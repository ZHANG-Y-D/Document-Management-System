(function(){

    var leftFolderDiv = document.getElementById("leftFolderDiv");

    var rightDocumentDiv = document.getElementById("rightDocumentDiv");
    var messageDiv = document.getElementById("messageDiv");
    var detailsDiv =  document.getElementById("detailsDiv");

    var leftTrashDiv = document.getElementById("leftTrashDiv");
    var trashIcon = document.getElementById("trash");

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



// TODO tag rebuild.(message tag)
// TODO Style


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
            messageDiv.innerHTML="";
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
                            messageDiv.innerHTML = "";
                            messageDiv.textContent = message;
                        }
                    }
                })
        }

        this.update = function (subFolderList) {

            leftFolderDiv.innerHTML ="";
            leftTrashDiv.innerHTML ="";
            trashIcon.style.visibility = "hidden";

            // Check browser support
            if (typeof (Storage) !== "undefined") {
                // Store
                sessionStorage.setItem("subFolderList", JSON.stringify(subFolderList));
            } else {
                messageDiv.innerHTML = "";
                messageDiv.innerHTML = "Sorry, your browser does not support Web Storage...";
            }

            if (subFolderList.length === 0) {
                leftFolderDiv.innerHTML = "";
                leftFolderDiv.textContent = "No folders yet!";
            } else {
                subFolderList.forEach(list => {
                    var row = document.createElement("span");
                    row.classList.add("folderName");

                    var ext = document.createElement("span");
                    var iconfolder = document.createElement("div");
                    iconfolder.classList.add("folder");
                    leftFolderDiv.appendChild(ext);
                    ext.appendChild(iconfolder);

                    row.textContent = list[0].folderNameOfSubFolder;
                    var folderCell = document.createElement("ul");
                    leftFolderDiv.appendChild(row);
                    leftFolderDiv.appendChild(folderCell);

                    list.forEach(subfolder => {
                        var li = document.createElement("li");
                        folderCell.appendChild(li);
                        var anchor = document.createElement("a");
                        anchor.classList.add("folderButton");
                        li.appendChild(anchor);
                        anchor.textContent = subfolder.subFolderName;
                        anchor.setAttribute('subFolderName', subfolder.subFolderName);
                        anchor.setAttribute('folderNameOfSubFolder', subfolder.folderNameOfSubFolder);

                        anchor.addEventListener("click", (e) => {
                            // dependency via module parameter
                            messageDiv.innerHTML = "";
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
                            self.refresh();
                            self.update(JSON.parse(req.responseText)); // self visible by
                        } else {
                            messageDiv.innerHTML = "";
                            messageDiv.style.visibility = "visible";
                            messageDiv.textContent = message;
                        }
                      }
              });
        }

        this.update = function(documentList){

            if (documentList.length === 0) {
                messageDiv.style.visibility = "visible";
                messageDiv.textContent = "No document yet!";
            } else {
                sessionStorage.setItem("documentList", JSON.stringify(documentList)); //for details
                rightDocumentDiv.style.visibility = "visible";

                var ext = document.createElement("span");
                var iconfolder = document.createElement("div");
                iconfolder.classList.add("folder");
                rightDocumentDiv.appendChild(ext);
                ext.appendChild(iconfolder);


                var p = document.createElement("span");
                p.textContent = documentList[0].subFolderNameOfDocument;
                p.classList.add("folderName");
                rightDocumentDiv.appendChild(p);
                var li = document.createElement("ul");
                rightDocumentDiv.appendChild(li);

                documentList.forEach(d => {
                    var documentCell = document.createElement("li");
                    var documentText = document.createElement("span");
                    documentText.textContent = d.documentName;
                    documentText.classList.add("folderName");

                    var ext1 = document.createElement("span");
                    var iconfile = document.createElement("div");
                    iconfile.classList.add("file");

                    ext1.appendChild(iconfile);

                    // Accedi
                    var anchorAccedi = document.createElement("a");
                    anchorAccedi.textContent = "accedi";
                    anchorAccedi.classList.add("button");
                    anchorAccedi.setAttribute('selectedDocument', d.documentName);

                    anchorAccedi.addEventListener("click", (e) => {
                        // dependency via module parameter
                        messageDiv.innerHTML="";
                        detailsDocument.show(e.target.getAttribute("selectedDocument")); // the list must know the details container
                    }, false);


                    var anchorSposta = document.createElement("a");
                    anchorSposta.textContent = "sposta";
                    anchorSposta.classList.add("button");
                    anchorSposta.setAttribute('fromDocumentName', d.documentName);
                    anchorSposta.setAttribute('fromSubFolderName', d.subFolderNameOfDocument);
                    anchorSposta.setAttribute('fromFolderName', d.folderNameOfDocument);

                    anchorSposta.addEventListener("click", (e) => {

                        messageDiv.innerHTML="";

                        choicesList.show(e.target.getAttribute("fromDocumentName"),
                            e.target.getAttribute("fromSubFolderName"),
                            e.target.getAttribute("fromFolderName")); // the list must know the details container

                    }, false);

                    anchorSposta.addEventListener("dragstart", function(event) {
                        // make it half transparent
                        messageDiv.innerHTML="";
                        event.target.style.opacity = .5;

                        choicesList.show(event.target.getAttribute("fromDocumentName"),
                            event.target.getAttribute("fromSubFolderName"),
                            event.target.getAttribute("fromFolderName"));

                    }, false);


                    li.appendChild(documentCell);
                    documentCell.appendChild(ext1);
                    documentCell.appendChild(documentText);
                    documentCell.appendChild(anchorAccedi);
                    documentCell.appendChild(anchorSposta);
                    anchorAccedi.href = "#";
                    anchorSposta.href = "#";

                });
            }
        }

        this.refresh = function() {
            rightDocumentDiv.innerHTML="";
            detailsDiv.innerHTML="";
        }
    }


    function DetailsDocument(){

        this.show = function(selectedDocument){
             messageDiv.innerHTML="";
            if (typeof (Storage) !== "undefined") {
                var documents = JSON.parse(sessionStorage.getItem("documentList"));

                documents.forEach(d => {
                    if(d.documentName === selectedDocument){
                        detailsDiv.innerHTML="";
                        var rowName = document.createElement("p");
                        rowName.textContent ="Nome: " + d.documentName;
                        var rowDate = document.createElement("p");
                        rowDate.textContent ="Data: " + d.dateOfDocument;
                        var rowSummary = document.createElement("p");
                        rowSummary.textContent = "Sommario: " + d.summaryOfDocument;
                        var rowType = document.createElement("p");
                        rowType.textContent = "Tipo: " + d.typeOfDocument;

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
                messageDiv.innerHTML = "";
                messageDiv.innerHTML = "Sorry, your browser does not support Web Storage...";
            }
        }


        this.update = function (fromDocumentName, fromSubFolderName, fromFolderName, subFolderList) {
            trashIcon.style.visibility = "visible";
            self.refresh();

            subFolderList.forEach(list => {
                var row = document.createElement("span");
                row.classList.add("folderName");

                var ext = document.createElement("span");
                var iconfolder = document.createElement("div");
                iconfolder.classList.add("folder");
                leftFolderDiv.appendChild(ext);
                ext.appendChild(iconfolder);

                row.textContent = list[0].folderNameOfSubFolder;
                var folderCell = document.createElement("ul");
                leftFolderDiv.appendChild(row);
                leftFolderDiv.appendChild(folderCell);
                list.forEach(subfolder => {
                    var li = document.createElement("li");
                    folderCell.appendChild(li);

                    if(subfolder.subFolderName !== fromSubFolderName){
                        var anchor = document.createElement("a");
                        anchor.classList.add("folderButton");
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

                    }else {
                        var originfolder = document.createElement("span");
                        originfolder.textContent = subfolder.subFolderName;
                        originfolder.id = "originSubfolder"
                        li.appendChild(originfolder);
                    }
                });
            });

            leftTrashDiv.innerHTML="";
            leftTrashDiv.style.visibility = "visible";
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

        this.refresh = function (){

            leftFolderDiv.innerHTML="";
            messageDiv.innerHTML="";

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
                            messageDiv.innerHTML = "";
                            messageDiv.textContent = message;
                        }
                    }
                }
            )
        }

        this.update = function (){
            messageDiv.style.visibility = "visible";
            messageDiv.textContent = "Sposta successful!!!"
        }

        this.refresh = function (toSubFolderName,toFolderNameOfSubFolder){

            documentsList.show(toSubFolderName,toFolderNameOfSubFolder);
            folderAndSubFolder.show();
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
                            messageDiv.innerHTML = "";
                            messageDiv.textContent = message;
                        }
                    }
                }
            )
        }

        this.update = function (){
            messageDiv.style.visibility = "visible";
            messageDiv.textContent = "Remove successful!!!"
        }

        this.refresh = function (subFolderName, folderName){
            leftTrashDiv.style.visibility = "hidden";
            trashIcon.style.visibility = "hidden";
            documentsList.show(subFolderName, folderName);
            folderAndSubFolder.show();
        }
    }

})();
