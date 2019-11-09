import React, {useEffect, useState, useRef} from "react";

export default () => {
    const [label, setLabel] = useState("loading AI model of kort en pittige kapsel")
    const videoElement = useRef(null)

    const setup = async () => {
        if (typeof window === "undefined") return null;
        const {mediaDevices} = window.navigator

        const stream = await mediaDevices.getUserMedia({video: true});

        if(videoElement && videoElement.current) {
            videoElement.current.srcObject = stream;
            videoElement.current.play();

            const {imageClassifier} = require("ml5");

            const classifier = await imageClassifier(
                "model/model.json",
                videoElement.current
            );

            loop(classifier)
        }
    };

    const loop = (classifier) => {
        classifier.classify()
            .then(results => {
                const labelPrediction = results[0].label;
                const confidence = results[0].confidence.toFixed(4);
                setLabel(`${labelPrediction} ${confidence}`);
                setTimeout(()=> loop(classifier), 1000) // Call again to create a loop
            })
    }

    useEffect(() => {
        setTimeout(() => setup(), 1000)
    }, []);

    return (
        <div className="outerContainer">
            <h2>{label}</h2>
            <br/>

            <div className="container">
                <video
                    ref={videoElement}
                    width={320}
                    height={240}
                    autoPlay
                />
            </div>


            <style jsx>
                {`
                    .container {
                        background-color: 'red';
                        display: flex;
                        flex: 1;
                    }
                    
                    video {
                        max-width: 480px
                    }
                `}
            </style>
        </div>
    );
};
