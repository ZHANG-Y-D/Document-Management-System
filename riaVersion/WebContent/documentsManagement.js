(function(){


    var leftFolderDiv = document.getElementById("leftFolderDiv");
    var leftMassageDiv = document.getElementById("leftMassageDiv");
    var leftTrashDiv = document.getElementById("leftTrashDiv");

    var rightSubFolderDiv = document.getElementById("rightSubFolderDiv");
    var rightDocumentDiv = document.getElementById("rightDocumentDiv");
    var rightMassageDiv = document.getElementById("rightMassageDiv");
    var pageOrchestrator = new PageOrchestrator(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv);


    window.addEventListener("load", () => {
          pageOrchestrator.start(); // initialize the components
          // pageOrchestrator.refresh(); // display initial content
      }, false);

})();

// TODO accedi
// TODO CSS
//TODO html
// TODO PageOrchestrator
// TODO logout
// TODO refresh sposta



function PageOrchestrator(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv){


    this.start = function(){

        new FolderAndSubFolder(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv).show();

        documentsList = new DocumentsList(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv);
    }

    this.refresh = function(){
         documentsList.reset();
    }

}

function FolderAndSubFolder(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv) {
    var self = this;
    this.show = function () {
        makeCall("GET", "GetFoldersAndSubFolders", null,
            function (req) {
                if (req.readyState === 4) {
                    var message = req.responseText;
                    if (req.status === 200) {
                        self.update(JSON.parse(req.responseText)); // self visible by
                    } else {
                        leftMassageDiv.innerHTML = "";
                        leftMassageDiv.textContent = message;
                    }
                }
            })
    }


    this.update = function (subFolderList) {


        leftFolderDiv.innerHTML="";
        leftMassageDiv.innerHTML="";
        leftTrashDiv.innerHTML = "";
        rightSubFolderDiv.innerHTML="";
        rightDocumentDiv.innerHTML="";
        rightMassageDiv.innerHTML="";


        // Check browser support
        if (typeof (Storage) !== "undefined") {
            // Store
            sessionStorage.setItem("subFolderList", JSON.stringify(subFolderList));
        } else {
            leftMassageDiv.innerHTML = "";
            leftMassageDiv.innerHTML = "Sorry, your browser does not support Web Storage...";
        }

        if (subFolderList.length === 0) {
            leftFolderDiv.innerHTML = "";
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

                        var documentsList = new DocumentsList(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv);

                        documentsList.show(e.target.getAttribute("subFolderName"), e.target.getAttribute("folderNameOfSubFolder")); // the list must know the details container
                    }, false);
                    anchor.href = "#";
                });
            });
        }
    }
}

function DocumentsList(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv){
    var self = this;
    this.show = function (subFolderName,folderNameOfSubFolder) {
        makeCall("GET", "GetListDocuments?subFolderName=" + subFolderName+"&folderName="+folderNameOfSubFolder, null,
          function(req) {
                  if (req.readyState === 4) {
                    var message = req.responseText;
                    if (req.status === 200) {
                      self.update(JSON.parse(req.responseText)); // self visible by
                    } else {
                        rightMassageDiv.innerHTML = "";
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
            rightMassageDiv.style.visibility = "visible";
            rightMassageDiv.textContent = "No document yet!";
        } else {
            rightDocumentDiv.style.visibility = "visible";
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

                var choicesList = new ChoicesList(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv);

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
        rightDocumentDiv.style.visibility = "hidden";
        rightMassageDiv.style.visibility = "hidden";

    }
}


function ChoicesList(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv) {
    var self = this;

    this.show = function (fromDocumentName, fromSubFolderName, fromFolderName) {

        if (typeof (Storage) !== "undefined") {
            var subFolderList = JSON.parse(sessionStorage.getItem("subFolderList"));
            self.update(fromDocumentName, fromSubFolderName, fromFolderName, subFolderList);

        } else {
            leftMassageDiv.innerHTML = "";
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

                var toDoSposta = new ToDoSposta(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv)
                anchor.addEventListener("click", (e) => {
                    toDoSposta.show(fromDocumentName, fromSubFolderName, fromFolderName,
                                     e.target.getAttribute("subFolderName"),
                                     e.target.getAttribute("folderNameOfSubFolder"))
                }, false);

                anchor.addEventListener("dragover", function(event) {

                    event.preventDefault();
                    event.target.style.opacity = .3;

                }, false);

                anchor.addEventListener("dragleave", function(event) {

                    event.preventDefault();
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

        leftTrashDiv.innerHTML = "";
        var trash = document.createElement("p");
        trash.textContent = "Trash";
        trash.style.color = "tomato";
        leftTrashDiv.appendChild(trash);
        var moveDocuToTrash = new RemoveDocuToTrash(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv);
        trash.addEventListener("click", () => {
            moveDocuToTrash.show(fromDocumentName, fromSubFolderName, fromFolderName)
        }, false);

        trash.addEventListener("dragover", function(event)  {
            event.preventDefault();
            event.target.style.opacity = .3;
        }, false);

        trash.addEventListener("dragleave", function(event)  {
            event.preventDefault();
            event.target.style.opacity = 1;
        }, false);

        trash.addEventListener("drop", function(event)  {
            console.log('DROP')
            // prevent default action (open as link for some elements)
            event.preventDefault();
            moveDocuToTrash.show(fromDocumentName, fromSubFolderName, fromFolderName)
        }, false);
    }
}


function RemoveDocuToTrash(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv){
    var self = this;

    this.show = function (documentName, subFolderName, folderName){
        makeCall("GET", "RemoveDocument?DocumentName=" + documentName
                                    +"&SubFolderName="+subFolderName
                                    +"&FolderName="+folderName, null,
            function (req) {
                if (req.readyState === 4) {
                    var message = req.responseText;
                    if (req.status === 200) {
                        self.refresh()
                        self.update();
                    } else {
                        rightMassageDiv.innerHTML = "";
                        rightMassageDiv.textContent = message;
                    }
                }
            }
        )
    }

    this.update = function (){
        rightMassageDiv.textContent = "Remove successful!!!"
    }

    this.refresh = function (){
        new FolderAndSubFolder(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv).show();
    }
}


function ToDoSposta(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv){
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

                        self.refresh()
                        self.update();

                    } else {
                        rightMassageDiv.innerHTML = "";
                        rightMassageDiv.textContent = message;
                    }
                }
            }
        )
    }

    this.update = function (){
        rightMassageDiv.textContent = "Sposta successful!!!"
    }

    this.refresh = function (){
        new FolderAndSubFolder(leftFolderDiv,leftMassageDiv,rightSubFolderDiv,rightDocumentDiv,rightMassageDiv,leftTrashDiv).show();
    }


}


