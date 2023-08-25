import { Col, Row } from "antd";
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";



export interface MediaPlayerRowProps {
    src: string | null | undefined;
}
export function MediaPlayerRow({ src }: MediaPlayerRowProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const waveformRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const currentVideoRef = videoRef.current;
        if(!currentVideoRef || !waveformRef.current) { return; }

        const onLoadStart: (this: HTMLVideoElement) => void = function() {
            if(!waveformRef.current) { return; }
            if(!this.currentSrc) {
                console.warn("No video source yet!");
                return;
            }

            wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                media: this,
                // minPxPerSec: 32,

                waveColor: "#4F4A85",
                progressColor: "#383351",
            });
        };

        let wavesurfer: WaveSurfer;
        currentVideoRef.addEventListener("loadstart", onLoadStart);

        return () => {
            currentVideoRef.removeEventListener("loadstart", onLoadStart);
            if(wavesurfer) {
                wavesurfer.destroy();
            }
        };
    });

    if(!src) { return <i>Could not load preview for this file</i>; }

    return <Row justify="center" gutter={24} align="middle">
        <Col xs={{ span: 12, offset: 0 }} md={{ span: 10, offset: 2}}>
            <video ref={videoRef} controls>
                <source src={src} type="video/mp4"/>
                Your browser does not support this video
            </video>
        </Col>
        <Col xs={{ span: 12}} md={{ span: 10 }}>
            <div
                ref={waveformRef}
                className="waveform-container py-4 bg-yellow-100 border-black border"
            />
        </Col>
    </Row>;
}
