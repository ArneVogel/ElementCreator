// create a unique name for the child;
function get_element_name(element, parent_name, i) {
    let tag = element.localName;
    let element_name = ""; 

    if (element.id != "") {
        element_name = element.id;
    } else {
        element_name = parent_name + "_" + tag + i;
    }
    return element_name;
}

function empty_string(string) {
    empty_chars = [" ", "\n", "\r"];
    for (let c of empty_chars) {
        while (string.includes(c)) {
            string = string.replace(c, "");
        }
    }
    return string == "";
}

function ce(html_doc, creation_string, parent_name) {
    for (let i in html_doc.childNodes) {
        let child = html_doc.childNodes[i];

        // the tagName of the child
        let type = child.localName;

        // add text to parent
        if (type == undefined) {
            if (child.nodeName == "#text" && !empty_string(child.nodeValue)) {
                let text = child.nodeValue.replace("\n", "");
                let node_name = parent_name + "node" + i;
                creation_string += `let ${node_name} = document.createTextNode("${text}");\n`;
                creation_string += `${parent_name}.appendChild(${node_name});\n`;
            }
            continue;
        }

        // unique name for the child
        let element_name = get_element_name(child, parent_name, i);

        // create the element
        creation_string += `let ${element_name} = document.createElement("${type}");\n`;

        let properties = ["href", "id"];
        for (let property of properties) {
            let property_value = child[property];
            if (property_value != undefined && property_value != "") {
                creation_string += `${element_name}.${property} = "${property_value}";\n`;
            }
        }

        // add children to the parent
        creation_string = ce(child, creation_string, element_name);

        // add classes to element
        for (let c of child.classList) {
            creation_string += `${element_name}.classList.add("${c}");\n`;
        }

        // add the child to the parent
        // skipping for the root
        if (parent_name != "") {
            creation_string += `${parent_name}.appendChild(${element_name});\n`;
        }
    }
    return creation_string;
}


function generate() {
    let txt = document.getElementById("html-input").value;

    let parser = new DOMParser();
    let doc = parser.parseFromString(txt, 'text/html').body;

    let creation_string = ce(doc, "", "");
    
    // display the creation string
    let output = document.getElementById("output");
    output.innerText = creation_string;

    // display the resulting html
    //let known_id = "wrapping_div";
    //let extra_txt = `<div id="${known_id}">${txt}</div>`;
    //let extra_doc = parser.parseFromString(extra_txt, 'text/html').body;
    //creation_string = ce(extra_doc, "", "");
    //let a = creation_string + ` document.getElementById("result").appendChild(${known_id})`;
    //eval(a);
}

function updateClipboard(newClip) {
  navigator.clipboard.writeText(newClip).then(function() {
        document.getElementById("copied").classList.remove("hide");
        setTimeout(function() {
            document.getElementById("copied").classList.add("hide");
        }, 2000);
    }, function() {
        alert("Could not copy");
    });
}
function copy() {
    let value = document.getElementById("output").innerText;
    updateClipboard(value);
}
