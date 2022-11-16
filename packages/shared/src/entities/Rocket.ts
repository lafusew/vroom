import { Vector3 } from "three";
import gameConfig from "../utils/gameConfig.js";
import trackConfig from "../utils/trackConfig.js";
import { Path } from "./Path.js";

class Rocket {
    public progress: number = 0;
    private paths: Path[];
    private laneNumber: number;
    public position = new Vector3();
    private target = new Vector3();
    private dot = 0;

    constructor(laneNumber: number, paths: Path[]) {
        this.laneNumber = laneNumber;
        this.paths = paths;
    }

    public changeLane(direction: number) {
        const newLane = this.laneNumber + direction;
        if (newLane >= 0 && newLane < gameConfig.numberOfPlayers) {
            this.laneNumber += direction;
            this.laneNumber = Math.min(Math.max(this.laneNumber, 0), gameConfig.numberOfPlayers - 1);
            this.checkNeighbourLanes(direction);
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

    private updatePosition(speedInput: number) {
        this.progress += 0.001 * speedInput;
        this.position.copy(this.paths[this.laneNumber].curve.getPointAt(this.progress % 1));
        this.target = this.paths[this.laneNumber].curve.getPointAt((this.progress + 0.001) % 1);
    }

    private computeCentrifugal() {
        const directionV3 = this.target.clone().sub(this.position);
        const angleV3 = this.paths[this.laneNumber].curve.getPointAt((this.progress + 0.01) % 1).sub(this.position);
        this.dot = directionV3.x * -angleV3.z + directionV3.z * angleV3.x;

        // const centrifugalV3 = this.target.clone().sub(this.position).cross(new Vector3(0, 1, 0).sub(this.position)).multiplyScalar(this.dot);

        // this.remove(this.centrifugalHelper);
        // this.centrifugalHelper = new ArrowHelper(this.centrifugalV3, this.mesh.position, Math.abs(this.dot) * 2000, 0x00ffff);
        // this.add(this.centrifugalHelper);
    }

    private checkEjection(speedInput: number) {
        const ejected = Math.abs(this.dot) * speedInput * 1000 > gameConfig.ejectionThreshold;
        if (ejected) console.log("Ejected");
    }

    public tick(speedInput: number) {
        this.updatePosition(speedInput);
        this.computeCentrifugal();
        this.checkEjection(speedInput);
    }
}

export { Rocket };