(function(){


    var leftFolderDiv = document.getElementById("leftFolderDiv");
    var leftMassageDiv = document.getElementById("leftMassageDiv");

    var rightSubFolderDiv = document.getElementById("rightSubFolderDiv");
    var rightDocumentDiv = document.getElementById("rightDocumentDiv");
    var rightMassageDiv = document.getElementById("rightMassageDiv");
    var pageOrchestrator = new PageOrchestrator(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv);

    window.addEventListener("load", () => {
          pageOrchestrator.start(); // initialize the components
          // pageOrchestrator.refresh(); // display initial content
      }, false);
    
})();

// TODO return abnormal message from server
// TODO cestino
// TODO accedi
// TODO refresh
// TODO CSS


function PageOrchestrator(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv){


    this.start = function(){

        new FolderAndSubFolder(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv).show();
        // choicesList = new ChoicesList(messageContainer);
    }

    this.refresh = function(){
        // documentsList.reset();
    }

}

function FolderAndSubFolder(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv) {
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
                        leftMassageDiv.textContent = message;
                    }
                }
            })
    }


    this.update = function (subFolderList) {

         leftFolderDiv.innerHTML="";
         leftMassageDiv.innerHTML="";
        rightSubFolderDiv.innerHTML="";
        rightDocumentDiv.innerHTML="";
         rightMassageDiv.innerHTML="";

        // Check browser support
        if (typeof (Storage) !== "undefined") {
            // Store
            sessionStorage.setItem("subFolderList", JSON.stringify(subFolderList));
        } else {
            leftMassageDiv.innerHTML = "Sorry, your browser does not support Web Storage...";
        }

        if (subFolderList.length === 0) {
            leftFolderDiv.textContent = "No folders yet!";
        } else {
            subFolderList.forEach(list => {
                var row = document.createElement("p");
                row.textContent = list[0].folderNameOfSubFolder;
                var folderCell = document.createElement("ul");
                leftFolderDiv.appendChild(row);
                leftFolderDiv.appendChild(folderCell);

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
                        var documentsList = new DocumentsList(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv);
                        documentsList.show(e.target.getAttribute("subFolderName"), e.target.getAttribute("folderNameOfSubFolder")); // the list must know the details container
                    }, false);
                    anchor.href = "#";
                });
            });
        }
    }
}

function DocumentsList(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv){
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
                        rightMassageDiv.textContent = message;
                    }
                  }
          })
    }

    this.update = function(documentList){

        rightSubFolderDiv.innerHTML="";
        rightDocumentDiv.innerHTML="";
        rightMassageDiv.innerHTML="";


        if (documentList.length === 0) {
            rightMassageDiv.textContent = "No document yet!";
        } else {

            var p = document.createElement("p");
            p.textContent = documentList[0].subFolderNameOfDocument;
            rightSubFolderDiv.appendChild(p);
            var li = document.createElement("ul");
            rightDocumentDiv.appendChild(li);

            documentList.forEach(d => {
                var documentCell = document.createElement("li");
                var documentText = document.createElement("span");
                documentText.textContent = d.documentName;
                var anchorSposta = document.createElement("a");
                anchorSposta.textContent = ">sposta"
                anchorSposta.setAttribute('fromDocumentName', d.documentName);
                anchorSposta.setAttribute('fromSubFolderName', d.subFolderNameOfDocument);
                anchorSposta.setAttribute('fromFolderName', d.folderNameOfDocument);

                var choicesList = new ChoicesList(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv);

                anchorSposta.addEventListener("click", (e) => {
                    // dependency via module parameter

                    choicesList.show(e.target.getAttribute("fromDocumentName"),
                                      e.target.getAttribute("fromSubFolderName"),
                                      e.target.getAttribute("fromFolderName")); // the list must know the details container
                }, false);

                anchorSposta.addEventListener("dragstart", function(event) {

                    // make it half transparent
                    event.target.style.opacity = .5;
                    choicesList.show(event.target.getAttribute("fromDocumentName"),
                        event.target.getAttribute("fromSubFolderName"),
                        event.target.getAttribute("fromFolderName"));

                }, false);

                li.appendChild(documentCell);
                li.appendChild(documentText);
                li.appendChild(anchorSposta);
                anchorSposta.href = "#";
            });
        }
    }

    this.refresh = function() {

    }
}


function ChoicesList(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv) {
    var self = this;

    this.show = function (fromDocumentName, fromSubFolderName, fromFolderName) {

        if (typeof (Storage) !== "undefined") {
            var subFolderList = JSON.parse(sessionStorage.getItem("subFolderList"));
            self.update(fromDocumentName, fromSubFolderName, fromFolderName, subFolderList);

        } else {
            leftMassageDiv.innerHTML = "Sorry, your browser does not support Web Storage...";
        }
    }


    this.update = function (fromDocumentName, fromSubFolderName, fromFolderName, subFolderList) {

        leftFolderDiv.innerHTML="";
        leftMassageDiv.innerHTML="";

        subFolderList.forEach(list => {
            var row = document.createElement("p");
            row.textContent = list[0].folderNameOfSubFolder;
            var folderCell = document.createElement("ul");
            leftFolderDiv.appendChild(row);
            leftFolderDiv.appendChild(folderCell);
            list.forEach(subfolder => {
                var li = document.createElement("li");
                folderCell.appendChild(li);
                var anchor = document.createElement("a");
                li.appendChild(anchor);
                anchor.textContent = subfolder.subFolderName;
                anchor.setAttribute('subFolderName', subfolder.subFolderName);
                anchor.setAttribute('folderNameOfSubFolder', subfolder.folderNameOfSubFolder);

                var toDoSposta = new ToDoSposta(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv)
                anchor.addEventListener("click", (e) => {
                    toDoSposta.show(fromDocumentName, fromSubFolderName, fromFolderName,
                                     e.target.getAttribute("subFolderName"),
                                     e.target.getAttribute("folderNameOfSubFolder"))
                }, false);


                // anchor.addEventListener("DOMContentLoaded", (e) => {
                //     // Get the element by id
                //     const element = document.getElementById("rightDocumentDiv");
                //     // Add the ondragstart event listener
                //     element.addEventListener("drop", drop_handler);
                //     toDoSposta.show(fromDocumentName, fromSubFolderName, fromFolderName,
                //         e.target.getAttribute("subFolderName"),
                //         e.target.getAttribute("folderNameOfSubFolder"))
                // });

                anchor.addEventListener("dragover", function(event) {

                    event.target.style.opacity = .3;

                }, false);

                anchor.addEventListener("dragleave", function(event) {

                    event.target.style.opacity = 1;

                }, false);

                anchor.addEventListener("drop", function(event) {

                    // prevent default action (open as link for some elements)
                    event.preventDefault();


                    toDoSposta.show(fromDocumentName, fromSubFolderName, fromFolderName,
                        event.target.getAttribute("subFolderName"),
                        event.target.getAttribute("folderNameOfSubFolder"))

                }, false);

                anchor.href = "#";
            });
        });
    }

    this.refresh = function () {

    }
}


function ToDoSposta(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv){
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
                        self.refresh();
                    } else {
                        rightMassageDiv.textContent = message;
                    }
                }
            }
        )
    }

    this.refresh = function(){
        location.reload();
    }
}