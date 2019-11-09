import { html } from "lit-html"
import { list_dropdown } from "./list-dropdown"
import { list_input } from "./list-input";

export const view_main = (continentList, oncheck) => html `
<h2>Your implemetation</h2>
<table>
    <tr>
        <td>
            Continent
        </td>
        <td id="continent">
            ${list_input(continentList, oncheck, [])}
        </td>
    </tr>
    <tr>
        <td>
            Country
        </td>
        <td id="country">
            ${list_dropdown([{name: '-- Please Select --'}])}
        </td>
    </tr>
    <tr>
        <td>
            City
        </td>
        <td id="cities">
            ${list_dropdown([{name: '-- Please Select --'}])}
        </td>
    </tr>
    <tr>
        <td colspan="2" height="20px">
            &nbsp;
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <b>Special Notes</b><br />
            <i>Please leave your comment or any explanation here for any thing that you want to
                return back to us.</i>
            <ol>
                <li>Sometime the api will fail because the user account is reach the limit</li>
                <li>Read the README.md file if page not working correctly</li>
            </ol>
        </td>
    </tr>
</table>
`