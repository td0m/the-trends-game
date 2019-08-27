import React, { useState } from "react";
import { Paper, Tooltip } from "@material-ui/core";

const Avatar = ({
  name,
  color,
  textColor,
  enableBorder = false,
  onClick
}: {
  name: string;
  color: string;
  textColor: "dark" | "white";
  enableBorder?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const onShowTooltip = () => {
    setShowTooltip(true);
    window.addEventListener("mousedown", () => {
      setShowTooltip(false);
    });
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onShowTooltip();
    onClick && onClick(e);
  };

  const size = 35;
  const c = textColor === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)";
  return (
    <Tooltip title={name} onClick={handleClick} open={showTooltip}>
      <Paper
        elevation={2}
        onMouseOver={onShowTooltip}
        style={{ borderRadius: "50%", margin: "0 4px", cursor: "pointer" }}
      >
        <div
          style={{
            width: size,
            height: size,
            background: color,
            color: c,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            border: `3px solid ${
              enableBorder ? "rgba(0,0,0,0.15)" : "transparent"
            }`,
            transition: "all 0.3s ease",
            fontSize: "0.8rem"
          }}
        >
          <span>{name.slice(0, 3)}</span>
        </div>
      </Paper>
    </Tooltip>
  );
};

export default Avatar;
