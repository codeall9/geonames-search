import {html} from "lit-html"

export const list_dropdown = (jsonArray, onchange, selectId) => html`
    <select @change=${onchange}}>
        ${jsonArray.map((item) =>
            html`<option value=${item.geonameId} ?selected=${selectId === item.geonameId}>${item.name}</option>`
        )}
    </select>
`