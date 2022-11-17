import { Vector3 } from "three";

const trackConfig = {
    spaceBetweenPaths: 0.04,
    distanceThreshold: 0.03,
    smoothness: 0.5,
    laneDivide: 1000,
    splines: [
        {
            name: "bone",
            coverSrc: "cover-example.png",
            pathGifSrc: "path-example2.png",
            normals: [],
            points: [
                new Vector3(-0.235, 0, 0.425),
                new Vector3(-0.325, 0, 0.535),
                new Vector3(-0.385, 0, 0.695),
                new Vector3(-0.31, 0, 0.85778277179195),
                new Vector3(-0.105, 0, 0.935),
                new Vector3(0.12636209801111, 0, 0.935),
                new Vector3(0.265, 0, 0.855),
                new Vector3(0.345, 0, 0.705),
                new Vector3(0.285, 0, 0.465),
                new Vector3(0.225, 0, 0.365),
                new Vector3(0.195, 0, 0.155),
                new Vector3(0.195, 0, -0.215),
                new Vector3(0.235, 0, -0.345),
                new Vector3(0.305, 0, -0.425),
                new Vector3(0.405, 0, -0.625),
                new Vector3(0.405, 0, -0.79947844413367),
                new Vector3(0.245, 0, -0.935),
                new Vector3(0.02750792021906, 0, -0.935),
                new Vector3(-0.125, 0, -0.915),
                new Vector3(-0.265, 0, -0.875),
                new Vector3(-0.345, 0, -0.815),
                new Vector3(-0.385, 0, -0.68317941143713),
                new Vector3(-0.31078455713547, 0, -0.57796955011999),
                new Vector3(-0.215, 0, -0.465),
                new Vector3(-0.185, 0, -0.305),
                new Vector3(-0.185, 0, -0.105),
                new Vector3(-0.195, 0, 0.175),
            ],
        },
        {
            name: "cloud",
            coverSrc: "cover-example.png",
            pathGifSrc: "path-example.png",
            normals: [],
            points: [
                new Vector3(0.62499999999992, 0, -0.0849999999735),
                new Vector3(0.49500000000889, 0, -0.28499999997934),
                new Vector3(0.46500000002236, 0, -0.58499999998068),
                new Vector3(0.21914344322997, 0, -0.76832463832227),
                new Vector3(-0.13499999997045, 0, -0.74500000000762),
                new Vector3(-0.35499999998078, 0, -0.5150000000175),
                new Vector3(-0.29499999998976, 0, -0.31500000001481),
                new Vector3(-0.38499999999694, 0, -0.15500000001884),
                new Vector3(-0.64500000000328, 0, -0.01375531201879),
                new Vector3(-0.75500000000817, 0, 0.09499999996454),
                new Vector3(-0.75500000001699, 0, 0.29152964880467),
                new Vector3(-0.52500000002164, 0, 0.39499999997487),
                new Vector3(-0.37500000002748, 0, 0.5249999999816),
                new Vector3(-0.21500000002792, 0, 0.53499999998879),
                new Vector3(-0.03500000002343, 0, 0.43499999999687),
                new Vector3(0.14499999997523, 0, 0.46500000000495),
                new Vector3(0.42499999996939, 0, 0.59500000001752),
                new Vector3(0.61499999997387, 0, 0.49500000002605),
                new Vector3(0.78499999997971, 0, 0.36500000003369),
                new Vector3(0.82499999999228, 0, 0.08500000003548),
            ],
        },
        {
            name: "intern",
            coverSrc: "cover-example.png",
            pathGifSrc: "path-example.png",
            normals: [],
            points: [
                new Vector3(0.685, 0, 0.62500000000001),
                new Vector3(0.635, 0, 0.39500000000001),
                new Vector3(0.685, 0, 0.28862217302273),
                new Vector3(0.66, 0, 0.08509886580379),
                new Vector3(0.48759376081416, 0, -0.08666231915238),
                new Vector3(0.405, 0, -0.27252065973805),
                new Vector3(0.545, 0, -0.48476639440923),
                new Vector3(0.545, 0, -0.67956727417592),
                new Vector3(0.475, 0, -0.83499999999999),
                new Vector3(0.245, 0, -0.84499999999999),
                new Vector3(0.145, 0, -0.65499999999999),
                new Vector3(0.115, 0, -0.48499999999999),
                new Vector3(0.115, 0, -0.22890852247685),
                new Vector3(0.15614151762903, 0, 0),
                new Vector3(0.135, 0, 0.15500000000001),
                new Vector3(0.01, 0, 0.21884275340481),
                new Vector3(-0.255, 0, 0.20500000000001),
                new Vector3(-0.385, 0, 0.03567177690777),
                new Vector3(-0.43116859748847, 0, -0.08666231915238),
                new Vector3(-0.475, 0, -0.27499999999999),
                new Vector3(-0.475, 0, -0.42370940224354),
                new Vector3(-0.555, 0, -0.53499999999999),
                new Vector3(-0.695, 0, -0.50499999999999),
                new Vector3(-0.795, 0, -0.27499999999999),
                new Vector3(-0.795, 0, 0),
                new Vector3(-0.75500000001699, 0, 0.41073615735409),
                new Vector3(-0.595, 0, 0.64500000000001),
                new Vector3(-0.255, 0, 0.76500000000001),
                new Vector3(0.095, 0, 0.82500000000001),
                new Vector3(0.435, 0, 0.86500000000001),
                new Vector3(0.685, 0, 0.76544820707853),
            ],
        },
        {
            name: "square",
            coverSrc: "cover-example.png",
            pathGifSrc: "path-example.png",
            normals: [],
            points: [
                new Vector3(0.485, 0, 0.465),
                new Vector3(0.435, 0, 0.275),
                new Vector3(0.46, 0, 0.1083586723431),
                new Vector3(0.555, 0, -0.075),
                new Vector3(0.685, 0, -0.37137483753011),
                new Vector3(0.675, 0, -0.555),
                new Vector3(0.595, 0, -0.695),
                new Vector3(0.365, 0, -0.735),
                new Vector3(0.205, 0, -0.655),
                new Vector3(-0.015, 0, -0.595),
                new Vector3(-0.285, 0, -0.675),
                new Vector3(-0.505, 0, -0.725),
                new Vector3(-0.685, 0, -0.605),
                new Vector3(-0.75500000001699, 0, -0.38591221661717),
                new Vector3(-0.675, 0, -0.235),
                new Vector3(-0.515, 0, -0.045),
                new Vector3(-0.485, 0, 0.115),
                new Vector3(-0.545, 0, 0.225),
                new Vector3(-0.615, 0, 0.395),
                new Vector3(-0.585, 0, 0.615),
                new Vector3(-0.395, 0, 0.755),
                new Vector3(-0.225, 0, 0.705),
                new Vector3(0.01, 0, 0.66368655346905),
                new Vector3(0.185, 0, 0.695),
                new Vector3(0.375, 0, 0.805),
                new Vector3(0.565, 0, 0.835),
                new Vector3(0.655, 0, 0.685),
                new Vector3(0.615, 0, 0.555),
            ],
        },
        {
            name: "square 3D",
            coverSrc: "cover-example.png",
            pathGifSrc: "path-example.png",
            normals: [],
            points: [
                new Vector3(0.535, 0, 0.415),
                new Vector3(0.485, 0.05598223805165, 0.225),
                new Vector3(0.51, 0.11126046697816, 0.0583586723431),
                new Vector3(0.605, 0.16513953097758, -0.125),
                new Vector3(0.735, 0.21694186955878, -0.42137483753011),
                new Vector3(0.725, 0.26601603825767, -0.605),
                new Vector3(0.645, 0.31174490092937, -0.745),
                new Vector3(0.415, 0.35355339059327, -0.785),
                new Vector3(0.255, 0.39091574123401, -0.705),
                new Vector3(0.035, 0.42336209961414, -0.645),
                new Vector3(-0.235, 0.45048443395121, -0.725),
                new Vector3(-0.455, 0.47194166515418, -0.775),
                new Vector3(-0.635, 0.48746395609091, -0.655),
                new Vector3(-0.70500000001699, 0.49685610494662, -0.43591221661717),
                new Vector3(-0.625, 0.5, -0.285),
                new Vector3(-0.465, 0.49685610494662, -0.095),
                new Vector3(-0.435, 0.48746395609091, 0.065),
                new Vector3(-0.495, 0.47194166515418, 0.175),
                new Vector3(-0.565, 0.45048443395121, 0.345),
                new Vector3(-0.535, 0.42336209961414, 0.565),
                new Vector3(-0.345, 0.39091574123401, 0.705),
                new Vector3(-0.175, 0.35355339059327, 0.655),
                new Vector3(0.06, 0.31174490092937, 0.61368655346905),
                new Vector3(0.235, 0.26601603825767, 0.645),
                new Vector3(0.425, 0.21694186955878, 0.755),
                new Vector3(0.615, 0.16513953097758, 0.785),
                new Vector3(0.705, 0.11126046697816, 0.635),
                new Vector3(0.665, 0.05598223805165, 0.505),
            ],
        },
        {
            name: "chicane",
            coverSrc: "cover-example.png",
            pathGifSrc: "path-example.png",
            normals: [],
            points: [
                new Vector3(-0.06310570271251, 0, 0.23500056669646),
                new Vector3(-0.06310570270924, 0, 0.53402671343428),
                new Vector3(-0.04146897211658, 0, 0.72500056669793),
                new Vector3(-0.00360469358199, 0, 0.8250005667005),
                new Vector3(0.03966876759457, 0, 0.82500056670345),
                new Vector3(0.05860090686465, 0, 0.70948407405994),
                new Vector3(0.07, 0, 0.53000056670549),
                new Vector3(0.06999999999749, 0, 0.30008356595348),
                new Vector3(0.06999999999432, 0, 0.01109497199543),
                new Vector3(0.06999999999087, 0, -0.30541634519672),
                new Vector3(0.05860090685088, 0, -0.54968051390012),
                new Vector3(0.02344121963895, 0, -0.75499943329766),
                new Vector3(-0.01442305889532, 0, -0.82499943330023),
                new Vector3(-0.06310570272388, 0, -0.80426570382381),
                new Vector3(-0.07392406801731, 0, -0.63499943330428),
                new Vector3(-0.0739240680151, 0, -0.4327089401642),
            ],
        },
        {
            name: "infinity",
            coverSrc: "cover-example.png",
            pathGifSrc: "path-example.png",
            normals: [],
            points: [
                new Vector3(-0.775, 0, -0.295),
                new Vector3(-0.54272727272727, 0, -0.405),
                new Vector3(-0.24811688311688, 0, -0.32568181818182),
                new Vector3(0.44308441558442, 0, 0.2862012987013),
                new Vector3(0.68103896103896, 0, 0.41084415584415),
                new Vector3(0.885, 0, 0.30886363636364),
                new Vector3(0.885, 0, 0.0336889386933),
                new Vector3(0.80568181818182, 0, -0.15571428571428),
                new Vector3(0.53373376623376, 0, -0.09905844155845),
                new Vector3(-0.20279220779221, 0, 0.26353896103896),
                new Vector3(-0.45207792207792, 0, 0.38818181818182),
                new Vector3(-0.80334415584415, 0, 0.27487012987013),
                new Vector3(-0.86, 0, -0.0424025974026),
            ],
        },
        {
            name: "infinity 3D",
            coverSrc: "cover-example.png",
            pathGifSrc: "path-example.png",
            normals: [],
            points: [
                new Vector3(0.215, 0, 0.705),
                new Vector3(0.44727272727273, 0.11965783214378, 0.595),
                new Vector3(0.74188311688312, 0.23236158602188, 0.67431818181818),
                new Vector3(1.43308441558442, 0.3315613291204, 1.28620129870131),
                new Vector3(1.67103896103896, 0.41149193294683, 1.41084415584415),
                new Vector3(1.875, 0.46750812134271, 1.30886363636364),
                new Vector3(1.875, 0.49635443704903, 1.0336889386933),
                new Vector3(1.79568181818182, 0.49635443704903, 0.84428571428572),
                new Vector3(1.52373376623376, 0.46750812134271, 0.90094155844155),
                new Vector3(0.78720779220779, 0.41149193294683, 1.26353896103896),
                new Vector3(0.53792207792208, 0.3315613291204, 1.38818181818182),
                new Vector3(0.18665584415585, 0.23236158602188, 1.27487012987014),
                new Vector3(0.13, 0.11965783214378, 0.9575974025974),
            ],
        },
        {
            name: "triangle",
            coverSrc: "cover-example.png",
            pathGifSrc: "path-example.png",
            normals: [],
            points: [
                new Vector3(0.285, 0, -0.475),
                new Vector3(0.285, 0, -0.765),
                new Vector3(-0.005, 0, -0.935),
                new Vector3(-0.295, 0, -0.785),
                new Vector3(-0.295, 0, -0.46500000001616),
                new Vector3(0.465, 0, 0.67500000004038),
                new Vector3(0.705, 0, 0.705),
                new Vector3(0.87499999997661, 0, 0.545),
                new Vector3(0.82499999998558, 0, 0.305),
                new Vector3(0.63499999998873, 0, 0.185),
                new Vector3(-0.59500000001127, 0, 0.23499999997306),
                new Vector3(-0.84500000001352, 0, 0.28499999996184),
                new Vector3(-0.9150000000207, 0, 0.4449999999587),
                new Vector3(-0.86500000003058, 0, 0.66499999996095),
                new Vector3(-0.61500000003372, 0, 0.72499999997531),
                new Vector3(-0.40500000002833, 0, 0.6549999999807),
            ],
        },
        {
            name: "triangle 3D",
            coverSrc: "cover-example.png",
            pathGifSrc: "path-example.png",
            default: true,
            normals: [],
            points: [
                new Vector3(0.335, 0, -0.455),
                new Vector3(0.335, 0.09754516100806, -0.745),
                new Vector3(0.045, 0.19134171618254, -0.915),
                new Vector3(-0.245, 0.2777851165098, -0.765),
                new Vector3(-0.245, 0.35355339059327, -0.44500000001616),
                new Vector3(0.515, 0.41573480615127, 0.69500000004038),
                new Vector3(0.755, 0.46193976625564, 0.725),
                new Vector3(0.92499999997661, 0.49039264020162, 0.565),
                new Vector3(0.87499999998558, 0.5, 0.325),
                new Vector3(0.68499999998873, 0.49039264020162, 0.205),
                new Vector3(-0.54500000001127, 0.46193976625564, 0.25499999997306),
                new Vector3(-0.79500000001352, 0.41573480615127, 0.30499999996184),
                new Vector3(-0.8650000000207, 0.35355339059327, 0.4649999999587),
                new Vector3(-0.81500000003058, 0.2777851165098, 0.68499999996095),
                new Vector3(-0.56500000003371, 0.19134171618254, 0.7449999999753),
                new Vector3(-0.35500000002833, 0.09754516100806, 0.6749999999807),
            ],
        },
        {
            name: "original",
            coverSrc: "cover-example.png",
            pathGifSrc: "path-example.png",
            normals: [],
            points: [
                new Vector3(-0.075, 0, -0.28500000000651),
                new Vector3(0.255, 0, -0.605),
                new Vector3(0.295, 0, -0.735),
                new Vector3(0.19500000004018, 0, -0.85499999999214),
                new Vector3(0.04000000004199, 0, -0.89536951663551),
                new Vector3(-0.12499999995903, 0, -0.87278847832121),
                new Vector3(-0.21177726611551, 0, -0.76832463833268),
                new Vector3(-0.215, 0, -0.605),
                new Vector3(0.085, 0, -0.285),
                new Vector3(0.0849999999863, 0, 0.345),
                new Vector3(-0.26500000002267, 0, 0.59499999999484),
                new Vector3(-0.315, 0, 0.755),
                new Vector3(-0.2250000000366, 0, 0.854999999989),
                new Vector3(-0.05500000004198, 0, 0.97499999999663),
                new Vector3(0.18499999995892, 0, 0.95500000000741),
                new Vector3(0.2649999999652, 0, 0.815000000011),
                new Vector3(0.29499999997463, 0, 0.625),
                new Vector3(-0.08500000001325, 0, 0.33499999999394),
            ],
        },
    ],
};
export default trackConfig;
