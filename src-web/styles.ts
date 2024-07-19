import { css } from "@emotion/react";

export const globalStyles = css`
.mecchi-btn {
  font-size: 13px;
  outline: none !important;
  border-radius: 0.25rem;
  padding: 0 10px;
  background-color: whitesmoke;
}
  
.mecchi-btn.primary {
  background: #3b82f6;
  color: white;

}

.mecchi-btn:hover {
  background-color: aliceblue;

}

.mecchi-btn.primary:hover {
  background: whitesmoke;
  color: black;
}
`

export const tooltipStyles = { fontSize: 11, zIndex: 1000, padding: "0 10px", background: 'aliceblue', color: 'black', textAlign: 'center' }