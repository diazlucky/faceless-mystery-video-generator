import React from "react";
import { Composition } from "remotion";
import { VideoComposition, defaultSegments } from "./VideoComposition";

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  const totalDurationSeconds = defaultSegments.reduce(
    (acc, seg) => acc + (seg.durationInSeconds || 4),
    0
  );
  const durationInFrames = Math.round(totalDurationSeconds * fps);

  return (
    <>
      <Composition
        id="FacelessMysteryVideo"
        component={VideoComposition}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          segments: defaultSegments,
        }}
      />
    </>
  );
};

