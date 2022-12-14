import { Vector3 } from "three";
import gameConfig from "../utils/gameConfig.js";
import trackConfig from "../utils/trackConfig.js";
import { Path } from "./Path.js";

class Rocket {
    public progress = 0;
    public relativeProgress = 0;
    public speed = 0;
    private paths: Path[];
    private laneNumber: number;
    public position = new Vector3();
    public directionV3 = new Vector3();
    public target = new Vector3();
    public dot = 0;
    public angleV3 = new Vector3();
    public isEjecting = false;
    public finished = false;
    public ejectionDirection = 0;

    constructor(laneNumber: number, paths: Path[]) {
        this.laneNumber = laneNumber;
        this.paths = paths;

        this.updatePosition(0);
    }

    public changeLane(direction: number, rockets: { [playerId: string]: Rocket }) {
        if (this.isEjecting) return;

        const newLane = this.laneNumber + direction;
        if (newLane >= 0 && newLane < gameConfig.numberOfPlayers) {
            this.laneNumber += direction;
            this.laneNumber = Math.min(Math.max(this.laneNumber, 0), gameConfig.numberOfPlayers - 1);
            this.checkNeighbourLanes(direction);
            this.checkLateralCollision(rockets);
        }
    }

    public collide() {
        this.progress = 0;
    }

    private checkNeighbourLanes(direction: number) {
        const rightDir = this.target.clone().sub(this.position).cross(new Vector3(0, 1, 0).sub(this.position));
        rightDir.y = this.position.y;
        rightDir.normalize();

        let newPos = this.position.clone().add(rightDir.clone().multiplyScalar(trackConfig.spaceBetweenPaths * direction));

        let nearestDistance = Infinity;
        let nearestIndex = 0;

        let distance, progressDiff;

        this.paths[this.laneNumber].spacedPoints.forEach((point, index) => {
            distance = point.distanceTo(newPos);
            progressDiff = Math.abs((this.progress % 1) - index / this.paths[this.laneNumber].spacedPoints.length);

            if (distance < nearestDistance && progressDiff < gameConfig.progressDifferenceThreshold) {
                nearestDistance = distance;
                nearestIndex = index;
            }
        });

        this.progress = nearestIndex / this.paths[this.laneNumber].spacedPoints.length;
    }

    public getRelativeProgress() {
        const rightDir = this.target.clone().sub(this.position).cross(new Vector3(0, 1, 0).sub(this.position));
        rightDir.y = this.position.y;
        rightDir.normalize();

        let newPos = this.position.clone().add(rightDir.clone().multiplyScalar(trackConfig.spaceBetweenPaths * -(this.laneNumber + 1)));

        let nearestDistance = Infinity;
        let nearestIndex = 0;

        let distance, progressDiff;

        this.paths[0].spacedPoints.forEach((point, index) => {
            distance = point.distanceTo(newPos);
            progressDiff = Math.abs((this.progress % 1) - index / this.paths[0].spacedPoints.length);

            if (distance < nearestDistance && progressDiff < gameConfig.progressDifferenceThreshold) {
                nearestDistance = distance;
                nearestIndex = index;
            }
        });

        this.relativeProgress = nearestIndex / this.paths[0].spacedPoints.length + Math.floor(this.progress);
    }

    public computeCentrifugal(progress: number) {
        this.directionV3 = this.target.clone().sub(this.position);
        this.angleV3 = this.paths[this.laneNumber].curve.getPointAt((progress + 0.01) % 1).sub(this.position);
        this.dot = this.directionV3.x * -this.angleV3.z + this.directionV3.z * this.angleV3.x;
    }

    public checkEjection(speed: number, callback?: () => void) {
        if (this.isEjecting || Math.abs(this.dot) < 0.00001) return;

        const ejected = Math.abs(this.dot) * speed * 100000 > gameConfig.ejectionThreshold;

        if (ejected) {
            console.log("Ejection");
            this.isEjecting = true;
            this.progress = Math.max(this.progress - 0.035, 0);
            setTimeout(() => (this.isEjecting = false), gameConfig.animationDuration);
            callback?.();
        }
    }

    public checkCollision(rockets: { [playerId: string]: Rocket }, callback?: (ejectedId: string) => void) {
        let distance;

        let otherRockets = Object.entries(rockets)
            .filter(([id, rocket]) => rocket != this)
            .map(([id, rocket]) => ({ id, obj: rocket }));
        let selfID = Object.entries(rockets)
            .filter(([id, rocket]) => rocket == this)
            .map(([id, rocket]) => id)[0];

        otherRockets.forEach((rocket) => {
            if (rocket.obj !== this) {
                distance = this.position.distanceTo(rocket.obj.position);

                if (distance < gameConfig.rocketBoundingRadius) {
                    if (Math.abs((this.relativeProgress % 1) - (rocket.obj.relativeProgress % 1)) < 0.1) {
                        if (this.relativeProgress % 1 < rocket.obj.relativeProgress % 1) {
                            console.log(`COLLISION - Same lane / Back - ${selfID} x ${rocket.id}`);
                            callback?.(rocket.id);
                        }
                    } else {
                        console.log(`COLLISION - Intersection - ${this.speed > rocket.obj.speed ? "GAGN??" : "PERDU"} - ${selfID} x ${rocket.id}`);
                        callback?.(this.speed > rocket.obj.speed ? rocket.id : selfID);
                    }
                }
            }
        });
    }

    protected checkLateralCollision(rockets: { [playerId: string]: Rocket }, callback?: (ejectedId: string) => void) {
        let distance;

        let otherRockets = Object.entries(rockets)
            .filter(([id, rocket]) => rocket != this)
            .map(([id, rocket]) => ({ id, obj: rocket }));
        let selfID = Object.entries(rockets)
            .filter(([id, rocket]) => rocket == this)
            .map(([id, rocket]) => id)[0];

        otherRockets.forEach((rocket) => {
            if (rocket.obj.laneNumber === this.laneNumber) {
                distance = this.position.distanceTo(rocket.obj.position);

                if (distance < gameConfig.lateralCollisionThreshold && Math.abs((this.relativeProgress % 1) - (rocket.obj.relativeProgress % 1)) < 0.1) {
                    console.log(`COLLISION - Lane change - ${selfID} x ${rocket.id}`);
                    callback?.(rocket.id);
                }
            }
        });
    }

    public updatePosition(progress: number) {
        this.position.copy(this.paths[this.laneNumber].curve.getPointAt(progress % 1));
        this.target = this.paths[this.laneNumber].curve.getPointAt((progress + 0.001) % 1);
    }

    public tick(speedInput: number, rockets: { [playerId: string]: Rocket }, dt: number, ejectionCallback?: (ejectedId?: string) => void) {
        if (this.finished) return;

        this.speed = speedInput * dt * 20;
        this.progress += 0.01 * this.speed;

        this.updatePosition(this.progress);
        this.computeCentrifugal(this.progress);

        this.checkEjection(this.speed, ejectionCallback);
        this.getRelativeProgress();
        this.checkCollision(rockets, ejectionCallback);
    }

    public getPositionAt(progress: number) {
        return this.paths[this.laneNumber].curve.getPointAt(progress % 1);
    }

    public getTargetAt(progress: number) {
        return this.paths[this.laneNumber].curve.getPointAt((progress + 0.001) % 1);
    }
}

export { Rocket };
