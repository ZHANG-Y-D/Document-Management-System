(function(){


    var nameDiv = document.getElementById("nameDiv");
    var massageDiv = document.getElementById("massageDiv");
    var pageOrchestrator = new PageOrchestrator(nameDiv,massageDiv);

    window.addEventListener("load", () => {
          pageOrchestrator.start(); // initialize the components
          // pageOrchestrator.refresh(); // display initial content
      }, false);

})();

function PageOrchestrator(nameDiv,massageDiv){


    this.start = function(){

        new FolderAndSubFolder(nameDiv,massageDiv).show();
        // choicesList = new ChoicesList(messageContainer);
    }

    this.refresh = function(){
        // documentsList.reset();
    }

}

function FolderAndSubFolder(nameDiv,massageDiv) {
    var self = this;

    this.show = function () {
        makeCall("GET", "GetFoldersAndSubFolders", null,
            function (req) {
                if (req.readyState === 4) {
                    var message = req.responseText;
                    if (req.status === 200) {
                        self.update(JSON.parse(req.responseText)); // self visible by
                        // closure
                    } else {
                        massageDiv.textContent = message;
                    }
                }
            })
    }


    this.update = function (subFolderList) {
        // var row, li, foldercell, subfoldercell, linkcell, anchor;

        // Check browser support
        if (typeof (Storage) !== "undefined") {
            // Store
            sessionStorage.setItem("subFolderList", JSON.stringify(subFolderList));
        } else {
            massageDiv.innerHTML = "Sorry, your browser does not support Web Storage...";
        }

        if (subFolderList.length === 0) {
            nameDiv.textContent = "No folders yet!";
        } else {
            subFolderList.forEach(list => {
                var row = document.createElement("p");
                row.textContent = list[0].folderNameOfSubFolder;
                var folderCell = document.createElement("ul");
                nameDiv.appendChild(row);
                nameDiv.appendChild(folderCell);

                list.forEach(subfolder => {
                    var li = document.createElement("li");
                    folderCell.appendChild(li);
                    var anchor = document.createElement("a");
                    li.appendChild(anchor);
                    anchor.textContent = subfolder.subFolderName;
                    anchor.setAttribute('subFolderName', subfolder.subFolderName);
                    anchor.setAttribute('folderNameOfSubFolder', subfolder.folderNameOfSubFolder);
                    anchor.addEventListener("click", (e) => {
                        // dependency via module parameter
                        var documentsList = new DocumentsList(nameDiv,massageDiv);
                        documentsList.show(e.target.getAttribute("subFolderName"), e.target.getAttribute("folderNameOfSubFolder")); // the list must know the details container
                    }, false);
                    anchor.href = "#";
                });
            });
        }
    }
}

function DocumentsList(nameDiv,massageDiv){
    var self = this;
    this.show = function (subFolderName,folderNameOfSubFolder) {
        makeCall("GET", "GetListDocuments?subFolderName=" + subFolderName+"&folderName="+folderNameOfSubFolder, null,
          function(req) {
                  if (req.readyState === 4) {
                    var message = req.responseText;
                    if (req.status === 200) {
                      self.update(JSON.parse(req.responseText)); // self visible by
                      // closure
                    } else {
                        massageDiv.textContent = message;
                    }
                  }
                })
    }

    this.update = function(documentList){
        // documentCell,documentText, linkcell;

        if (documentList.length === 0) {
            massageDiv.textContent = "No document yet!";
        } else {

            var p = document.createElement("p");
            p.textContent = documentList[0].subFolderNameOfDocument;
            nameDiv.appendChild(p);
            var li = document.createElement("ul");
            nameDiv.appendChild(li);

            documentList.forEach(d => {
                var documentCell = document.createElement("li");
                var documentText = document.createElement("span");
                documentText.textContent = d.documentName;
                var anchorSposta = document.createElement("a");
                anchorSposta.textContent = ">sposta"
                anchorSposta.setAttribute('fromDocumentName', d.documentName);
                anchorSposta.setAttribute('fromSubFolderName', d.subFolderNameOfDocument);
                anchorSposta.setAttribute('fromFolderName', d.folderNameOfDocument);
                anchorSposta.addEventListener("click", (e) => {
                    // dependency via module parameter
                    var choicesList = new ChoicesList(nameDiv,massageDiv);
                    choicesList.show(e.target.getAttribute("fromDocumentName"),
                                      e.target.getAttribute("fromSubFolderName"),
                                      e.target.getAttribute("fromFolderName")); // the list must know the details container
                }, false);

                li.appendChild(documentCell);
                li.appendChild(documentText);
                li.appendChild(anchorSposta);
            });
        }
    }
    this.reset = function() {
         // this.divContainer.style.visibility = "hidden";
    }
}


function ChoicesList(nameDiv,massageDiv) {
    var self = this;

    this.show = function (fromDocumentName, fromSubFolderName, fromFolderName) {

        if (typeof (Storage) !== "undefined") {
            var subFolderList = JSON.parse(sessionStorage.getItem("subFolderList"));
            self.update(fromDocumentName, fromSubFolderName, fromFolderName, subFolderList);

        } else {
            massageDiv.innerHTML = "Sorry, your browser does not support Web Storage...";
        }
    }


    this.update = function (fromDocumentName, fromSubFolderName, fromFolderName, subFolderList) {

        subFolderList.forEach(list => {
            var row = document.createElement("p");
            row.textContent = list[0].folderNameOfSubFolder;
            var folderCell = document.createElement("ul");
            nameDiv.appendChild(row);
            nameDiv.appendChild(folderCell);
            list.forEach(subfolder => {
                var li = document.createElement("li");
                folderCell.appendChild(li);
                var anchor = document.createElement("a");
                li.appendChild(anchor);
                anchor.textContent = subfolder.subFolderName;
                anchor.setAttribute('subFolderName', subfolder.subFolderName);
                anchor.setAttribute('folderNameOfSubFolder', subfolder.folderNameOfSubFolder);
                anchor.addEventListener("click", (e) => {
                    new ToDoSposta(nameDiv,massageDiv).show(fromDocumentName, fromSubFolderName, fromFolderName,
                                     e.target.getAttribute("subFolderName"),
                                     e.target.getAttribute("folderNameOfSubFolder"))
                }, false);
                anchor.href = "#";
            });
        });

    }


}


function ToDoSposta(nameDiv,massageDiv){
	var self = this;

    this.show = function (fromDocumentName, fromSubFolderName, fromFolderName,toSubFolderName,toFolderNameOfSubFolder) {
        makeCall("GET", "DoSposta?FromDocumentName=" + fromDocumentName
            +"&FromSubFolderName="+fromSubFolderName
            +"&FromFolderName="+fromFolderName
            +"&ToSubFolderName="+toSubFolderName
            +"&ToFolderName="+toFolderNameOfSubFolder, null,
            function (req) {
                if (req.readyState === 4) {
                    var message = req.responseText;
                    if (req.status === 200) {
                        self.update();
                    } else {
                        massageDiv.textContent = message;
                    }
                }
            })
    }


    this.update = function(){
        new FolderAndSubFolder(nameDiv,massageDiv).show();
    }


}
