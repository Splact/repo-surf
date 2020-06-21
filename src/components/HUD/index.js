import React from "react";
import create from "zustand";

import "./style.scss";

export const [useHUD] = create(set => ({
  log: set
}));

export const HUD = ({ filter }) => {
  const hud = useHUD(hud => hud);

  const keys = Object.keys(hud).filter(k => k !== "log" && filter(k));

  return (
    <table className="hud">
      <tbody>
        {keys.map(k => (
          <tr key={k}>
            <th>{k}</th>
            <td>{hud[k]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
HUD.defaultProps = {
  filter: f => true
};

export default HUD;