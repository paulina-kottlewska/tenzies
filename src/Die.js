import React from "react";
import faces from "./die-face-data";

export default function Die(props) {

    // Check if value from props equals the value of the die face; if yes, return the styled divs that represent the value as dots. 
    function getDieFace() {
       for(let i = 0; i < faces.length; i++) {
            if(props.value === faces[i].value) {
                return faces[i].divs
            } 
          }
        }

    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    return (
        <div style={styles} className="die" onClick={props.holdDice}>
            {getDieFace()}
        </div>
    )
}