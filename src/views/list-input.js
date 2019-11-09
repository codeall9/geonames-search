import {html} from "lit-html"

export const list_input = (checkboxs, oncheck, checkIds) => {
    return html`
    ${checkboxs.map((item, index) => html`
        <input 
            type="checkbox" 
            value=${item.geonameId} 
            @click=${oncheck} 
            ?checked=${checkIds.indexOf(item.geonameId) !== -1} />${item.name}
        ${index === 3 ? html`<br />`: ''}
    `)}
    `
}