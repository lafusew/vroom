import { Rocket } from "./Rocket.js";
import { Track } from "./Track.js";

class Game {
    public track: Track;
    public rockets = new Map<string, Rocket>();
    constructor(splineName: string, playerIds: string[]) {
        this.track = new Track(splineName);

        for (let i = 0; i < playerIds.length; i++) {
            this.rockets.set(playerIds[i], new Rocket(i, this.track.paths));
        }
    }

    // private checkCollisions(rockets: Rocket[]) {
    //     rockets.forEach((rocket) => {
    //         this.rockets.forEach((rocket) => {
    //             if (rocket !== rocket) {
    //                 const distance = rocket.position.distanceTo(rocket.position);

    //                 if (distance < gameConfig.rocketBoundingRadius) {
    //                     rocket.collide();
    //                 }
    //             }
    //         });
    //     });
    // }

    public onChangeLine(playerId: string, direction: number) {
        this.rockets.get(playerId)?.changeLane(direction);
    }

    public update(inputs: any[]) {
        // this.rockets.forEach((rocket, i) => {
        //     rocket.tick(inputs[i].speedInput);
        // });
    }
}

export { Game };
