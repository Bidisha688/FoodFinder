/*<div id="parent">
  <div id="child">
    <h1>I'm h1 tag</h1>
  </div>
</div>
*/
        const parent = React.createElement("div",{id:"parent"},
            [React.createElement("div",{id:"child 1 "},
            [React.createElement("h1",{},"i am  a h1 tag"),
                React.createElement("h2",{},"i am  a h2 tag")]),
                React.createElement("div",{id:"child 2 "},
                    [React.createElement("h1",{},"i am  a h1 tag"),
                        React.createElement("h2",{},"i am  a h2 tag")])]);


const heading = React.createElement("h1",{id :"heading"},"hello from react");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(parent);