import type { ColProps} from "antd";
import { Col, Row } from "antd";
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";



export interface MediaPlayerRowProps {
    src: string | null | undefined;

    gutter?: number;
    mediaColProps?: ColProps;
    waveformColProps?: ColProps;
}
export function MediaPlayerRow({
    src,
    gutter,
    mediaColProps,
    waveformColProps
}: MediaPlayerRowProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const waveformRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let wavesurfer: WaveSurfer;

        const currentWaveformRef = waveformRef.current;
        const currentVideoRef = videoRef.current;
        if(!currentVideoRef || !currentWaveformRef) { return; }

        const onLoadStart: (this: HTMLVideoElement) => void = function() {
            if(!currentWaveformRef) { return; }
            if(!this.currentSrc) {
                console.warn("No video source yet!");
                return;
            }

            wavesurfer = WaveSurfer.create({
                container: currentWaveformRef,
                media: this,
                minPxPerSec: 64,
                
                waveColor: "#4F4A85",
                progressColor: "#383351",
            });
        };

        const scale = 0.2;
        const onWheel: (this: HTMLDivElement, ev: WheelEvent) => void = function(ev) {
            if(ev.shiftKey || ev.ctrlKey) {
                // Don't zoom if the user is trying to scroll horizontally or page zoom.
                return;
            }

            // prevent scrolling the sidebar while zooming
            ev.preventDefault();
            const wrapperContainer = wavesurfer.getWrapper();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const scrollContainer = wrapperContainer.parentElement!;

            const duration = wavesurfer.getDuration();
            const oldMinPxPerSec = wavesurfer.options.minPxPerSec;
            /** Width of the current waveform container, in pixels. */
            const containerWidth = scrollContainer.clientWidth;
            const newMinPxPerSec = ev.deltaY > 0 ? oldMinPxPerSec / (1+ scale) : oldMinPxPerSec * (1 + scale);
            console.log(newMinPxPerSec * duration, containerWidth);
            if (newMinPxPerSec * duration < containerWidth) {
                wavesurfer.zoom(containerWidth / duration);
                scrollContainer.scrollLeft = 0;
            } else {
                /** MouseEvent offset from the left of the container, in pixels. */
                const x = ev.clientX - scrollContainer.getBoundingClientRect().left;
                const scrollX = scrollContainer.scrollLeft;
                /** Timestamp of the cursor, in seconds. */
                const pointerTime = (scrollX + x) / oldMinPxPerSec;
                /** Timestamp of the new left side of the scroll window, in seconds. */
                const newLeftSec = pointerTime - (x / newMinPxPerSec);

                console.log({
                    x, scrollX, pointerTime, newLeftSec,
                    oldMinPxPerSec, newMinPxPerSec
                });

                wavesurfer.zoom(newMinPxPerSec);
                scrollContainer.scrollLeft = newLeftSec * newMinPxPerSec;
            }
        };

        currentVideoRef.addEventListener("loadstart", onLoadStart);
        currentWaveformRef.addEventListener("wheel", onWheel);

        return () => {
            currentVideoRef.removeEventListener("loadstart", onLoadStart);
            currentWaveformRef.removeEventListener("wheel", onWheel);
            if(wavesurfer) {
                wavesurfer.destroy();
            }
        };
    });

    if(!src) { return <i>Could not load preview for this file</i>; }

    return <Row justify="center" align="middle" gutter={gutter ?? 0}>
        <Col {...mediaColProps}>
            <video ref={videoRef} controls>
                <source src={src} type="video/mp4"/>
                Your browser does not support this video
            </video>
        </Col>
        <Col {...waveformColProps}>
            <div
                ref={waveformRef}
                className="waveform-container py-4 bg-yellow-100 border-black border"
            />
        </Col>
    </Row>;
}
