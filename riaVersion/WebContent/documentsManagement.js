(function(){

    var leftFolderDiv = document.getElementById("leftFolderDiv");
    var leftTrashDiv = document.getElementById("leftTrashDiv");
    var rightDocumentDiv = document.getElementById("rightDocumentDiv");
    var massageDiv = document.getElementById("MassageDiv");
    var detailsDiv =  document.getElementById("detailsDiv");

    var username =  document.getElementById("username")
    var pageOrchestrator = new PageOrchestrator();

    var folderAndSubFolder;
    var documentsList;
    var choicesList;
    var detailsDocument;
    var toDoSposta;
    var moveDocuToTrash;


    window.addEventListener("load", () => {
          pageOrchestrator.start(); // initialize the components
          pageOrchestrator.refresh(); // display initial content
      }, false);



// TODO CSS
// TODO logout


    function PageOrchestrator(){

        this.start = function(){

            moveDocuToTrash = new RemoveDocuToTrash();
            toDoSposta = new ToDoSposta();
            choicesList = new ChoicesList();
            detailsDocument = new DetailsDocument()
            documentsList = new DocumentsList();
            folderAndSubFolder = new FolderAndSubFolder();
            folderAndSubFolder.show();

            username.innerText = sessionStorage.getItem('username');
        }

        this.refresh = function(){
            leftFolderDiv.innerHTML="";
            massageDiv.innerHTML="";
            leftTrashDiv.innerHTML = "";
            rightDocumentDiv.innerHTML="";
            detailsDiv.innerText="";
        }

    }

    function FolderAndSubFolder() {
        var self = this;

        this.show = function () {
            makeCall("GET", "GetFoldersAndSubFolders", null,
                function (req) {
                    if (req.readyState === 4) {
                        var message = req.responseText;
                        if (req.status === 200) {
                            self.update(JSON.parse(req.responseText));
                        } else {
                            massageDiv.innerHTML = "";
                            massageDiv.textContent = message;
                        }
                    }
                })
        }


        this.update = function (subFolderList) {

            // Check browser support
            if (typeof (Storage) !== "undefined") {
                // Store
                sessionStorage.setItem("subFolderList", JSON.stringify(subFolderList));
            } else {
                massageDiv.innerHTML = "";
                massageDiv.innerHTML = "Sorry, your browser does not support Web Storage...";
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
                            documentsList.show(e.target.getAttribute("subFolderName"), e.target.getAttribute("folderNameOfSubFolder"));
                        }, false);
                        anchor.href = "#";
                    });
                });
            }
        }
    }


    function DocumentsList(){
        var self = this;
        this.show = function(subFolderName,folderNameOfSubFolder) {
            makeCall("GET", "GetListDocuments?subFolderName=" + subFolderName+"&folderName="+folderNameOfSubFolder, null,
              function(req) {
                      if (req.readyState === 4) {
                        var message = req.responseText;
                        if (req.status === 200) {
                          self.update(JSON.parse(req.responseText)); // self visible by
                        } else {
                            massageDiv.innerHTML = "";
                            massageDiv.textContent = message;
                        }
                      }
              });
        }

        this.update = function(documentList){

            rightDocumentDiv.innerHTML="";
            // massageDiv.innerHTML="";
            detailsDiv.innerHTML="";

            if (documentList.length === 0) {
                massageDiv.style.visibility = "visible";
                massageDiv.textContent = "No document yet!";
            } else {
                sessionStorage.setItem("documentList", JSON.stringify(documentList)); //for details
                rightDocumentDiv.style.visibility = "visible";
                var p = document.createElement("p");
                p.textContent = documentList[0].subFolderNameOfDocument;
                rightDocumentDiv.appendChild(p);
                var li = document.createElement("ul");
                rightDocumentDiv.appendChild(li);

                documentList.forEach(d => {
                    var documentCell = document.createElement("li");
                    var documentText = document.createElement("span");
                    documentText.textContent = d.documentName;

                    // Accedi
                    var anchorAccedi = document.createElement("a");
                    anchorAccedi.textContent = ">accedi";
                    anchorAccedi.setAttribute('selectedDocument', d.documentName);

                    anchorAccedi.addEventListener("click", (e) => {
                        // dependency via module parameter
                        detailsDocument.show(e.target.getAttribute("selectedDocument")); // the list must know the details container
                    }, false);


                    var anchorSposta = document.createElement("a");
                    anchorSposta.textContent = ">sposta"
                    anchorSposta.setAttribute('fromDocumentName', d.documentName);
                    anchorSposta.setAttribute('fromSubFolderName', d.subFolderNameOfDocument);
                    anchorSposta.setAttribute('fromFolderName', d.folderNameOfDocument);

                    anchorSposta.addEventListener("click", (e) => {

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
                    documentCell.appendChild(documentText);
                    documentCell.appendChild(anchorAccedi);
                    documentCell.appendChild(anchorSposta);
                    anchorAccedi.href = "#";
                    anchorSposta.href = "#";


                });
            }
        }

        this.refresh = function() {
            rightDocumentDiv.style.visibility = "hidden";
            massageDiv.style.visibility = "hidden";
        }
    }


    function DetailsDocument(){
        //this.detailsDiv = detailsDiv;

        this.show = function(selectedDocument){

            if (typeof (Storage) !== "undefined") {
                var documents = JSON.parse(sessionStorage.getItem("documentList"));

                documents.forEach(d => {
                    if(d.documentName === selectedDocument){
                        //detailsDiv.style.visibility = "visible";
                        detailsDiv.innerHTML="";
                        var rowName = document.createElement("p");
                        rowName.textContent = d.documentName;
                        var rowDate = document.createElement("p");
                        rowDate.textContent = d.dateOfDocument;
                        var rowSummary = document.createElement("p");
                        rowSummary.textContent = d.summaryOfDocument;
                        var rowType = document.createElement("p");
                        rowType.textContent = d.typeOfDocument;

                        detailsDiv.appendChild(rowName);
                        detailsDiv.appendChild(rowDate);
                        detailsDiv.appendChild(rowSummary);
                        detailsDiv.appendChild(rowType);
                    }

                });

            } else {
                detailsDiv.innerHTML = "Sorry, your browser does not support Web Storage...";
            }
        }


    }

    function ChoicesList() {
        var self = this;

        this.show = function (fromDocumentName, fromSubFolderName, fromFolderName) {

            if (typeof (Storage) !== "undefined") {
                var subFolderList = JSON.parse(sessionStorage.getItem("subFolderList"));
                self.update(fromDocumentName, fromSubFolderName, fromFolderName, subFolderList);

            } else {
                massageDiv.innerHTML = "";
                massageDiv.innerHTML = "Sorry, your browser does not support Web Storage...";
            }
        }


        this.update = function (fromDocumentName, fromSubFolderName, fromFolderName, subFolderList) {

            leftFolderDiv.innerHTML="";
            massageDiv.innerHTML="";

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
                // prevent default action (open as link for some elements)
                event.preventDefault();
                moveDocuToTrash.show(fromDocumentName, fromSubFolderName, fromFolderName)
            }, false);
        }
    }

    function ToDoSposta(){
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

                            self.refresh(toSubFolderName,toFolderNameOfSubFolder)
                            self.update();

                        } else {
                            massageDiv.innerHTML = "";
                            massageDiv.textContent = message;
                        }
                    }
                }
            )
        }

        this.update = function (){
            massageDiv.innerHTML = "";
            massageDiv.textContent = "Sposta successful!!!"
        }

        this.refresh = function (toSubFolderName,toFolderNameOfSubFolder){
            documentsList.show(toSubFolderName,toFolderNameOfSubFolder);
        }
    }

    function RemoveDocuToTrash(){
        var self = this;

        this.show = function (documentName, subFolderName, folderName){
            makeCall("GET", "RemoveDocument?DocumentName=" + documentName
                +"&SubFolderName="+subFolderName
                +"&FolderName="+folderName, null,
                function (req) {
                    if (req.readyState === 4) {
                        var message = req.responseText;
                        if (req.status === 200) {
                            self.refresh(subFolderName, folderName)
                            self.update();
                        } else {
                            massageDiv.innerHTML = "";
                            massageDiv.textContent = message;
                        }
                    }
                }
            )
        }

        this.update = function (){
            massageDiv.innerHTML = "";
            massageDiv.textContent = "Remove successful!!!"
        }

        this.refresh = function (subFolderName, folderName){
            documentsList.show(subFolderName, folderName);
        }
    }

})();