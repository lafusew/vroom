import { Vector3 } from "three";
import { Spline } from "../types/index.js";
import gameConfig from "../utils/gameConfig.js";
import { mod } from "../utils/index.js";
import trackConfig from "../utils/trackConfig.js";
import { Path } from "./Path.js";

class Track {
    splineName: string;
    paths: Path[] = [];

    constructor(splineName: string) {
        this.splineName = splineName;

        this.paths = this._createPaths();
    }

    _createPaths() {
        const spline = trackConfig.splines.find((el) => el.name === this.splineName) as Spline;

        if (!spline) throw "Spline name not found";

        const nbPoints = spline.points.length;
        spline.normals = [];

        let previousPoint: Vector3, nextPoint: Vector3, tangent: Vector3, normal: Vector3;

        const paths: Path[] = [];

        for (let i = 0; i < nbPoints; i++) {
            previousPoint = spline.points[mod(i - 1, nbPoints)];
            nextPoint = spline.points[mod(i + 1, nbPoints)];
            tangent = nextPoint.clone().sub(previousPoint).normalize();

            normal = new Vector3(0, -1, 0);
            normal.cross(tangent);
            spline.normals.push(normal);
        }

        for (let i = 0; i < gameConfig.numberOfPlayers; i++) paths.push(new Path(1 + i * trackConfig.spaceBetweenPaths, spline, i === 0));

        return paths;
    }
}

export { Track };
