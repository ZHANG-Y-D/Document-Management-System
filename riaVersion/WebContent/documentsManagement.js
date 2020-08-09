(function(){

    var folderAndSubFolder, documentsList, detailsDocument, choicesList,
        pageOrchestrator = new PageOrchestrator();

    window.addEventListener("load", () => {
          pageOrchestrator.start(); // initialize the components
          pageOrchestrator.refresh(); // display initial content
      }, false);


    function PageOrchestrator(){

        var messageContainer = document.getElementById("name");
        var documentDiv = document.getElementById("documents");
        this.start = function (){

            folderAndSubFolder = new FolderAndSubFolder(messageContainer)
            folderAndSubFolder.show();

            documentsList = new documentsList(documentDiv);
            choicesList = new ChoicesList(messageContainer);
        }


        this.refresh = function(){
           // documentsList.reset();
        }

    }

    function FolderAndSubFolder(_messagecell){
        this.messageCell = _messagecell;

        this.show = function () {
            var self = this;
            makeCall("GET", "GetFoldersAndSubFolders", null,
              function(req) {
                      if (req.readyState == 4) {
                        var message = req.responseText;
                        if (req.status == 200) {
                          self.update(JSON.parse(req.responseText)); // self visible by
                          // closure
                        } else {
                          self.messageCell.textContent = message;
                        }
                      }
                    })
        }


        this.update = function(subfolderList){
            var l = subfolderList.length,
            row,li,foldercell,subfoldercell, linkcell, anchor;

            if (subfolderList.length == 0) {
                messageCell.textContent = "No folders yet!";
              } else {
                  var self = this;
                  subfolderList.forEach(list => {
                 	row = document.createElement("p");
                 	row.textContent = list[0].folderNameOfSubFolder;
                      foldercell = document.createElement("ul");
                     // foldercell.textContent = list[0].folderName;
                      self.messageCell.appendChild(row);
                      self.messageCell.appendChild(foldercell);

                      list.forEach(subfolder =>{
                               li = document.createElement("li");
                               foldercell.appendChild(li);
                               anchor = document.createElement("a");
                               li.appendChild(anchor);
                               anchor.textContent = subfolder.subFolderName;
                               anchor.setAttribute('subFolderName',subfolder.subFolderName);
                               anchor.setAttribute('folderNameOfSubFolder',subfolder.folderNameOfSubFolder);
                               anchor.addEventListener("click", (e) => {
                                 // dependency via module parameter
                                   documentsList.show(e.target.getAttribute("subFolderName"),e.target.getAttribute("folderNameOfSubFolder")); // the list must know the details container
                               }, false);
                               anchor.href = "#";

                              // anchor.appendChild(subfoldercell);
                           });

                  });

              }

        }

}


        function documentsList(_divCell){
            this.divContainer = _divCell;

            this.show = function (subFolderName,folderNameOfSubFolder) {
                var self = this;
                makeCall("GET", "GetListDocuments?subFolderName=" + subFolderName+"&folderName="+folderNameOfSubFolder, null,
                  function(req) {
                          if (req.readyState === 4) {
                            var message = req.responseText;
                            if (req.status === 200) {
                              self.update(JSON.parse(req.responseText)); // self visible by
                              // closure
                            } else {
                              self.divContainer.textContent = message;
                            }
                          }
                        })
            }


            this.update = function(documentList){
                p,li,documentCell,documentText, linkcell, anchorSposta;

                if (documentList.length === 0) {
                    divContainer.textContent = "No document yet!";
                } else {
                      var self = this;
                      p = document.createElement("p");
                      p.textContent = documentList[0].subFolderNameOfDocument;
                      self.divContainer.appendChild(p);
                      li =  document.createElement("ul");
                      self.divContainer.appendChild(li);

                      documentList.forEach(d => {

                          documentCell = document.createElement("li");
                          documentText = document.createElement("span");
                          documentText.textContent = d.documentName;


                          anchorSposta = document.createElement("a");
                          anchorSposta.textContent = ">sposta"
                          anchorSposta.setAttribute('documentid',d.id);
                          anchorSposta.setAttribute('subfolderid',d.subfolderid);
                          anchorSposta.addEventListener("click", (e) => {
                            // dependency via module parameter
                            choicesList.show(e.target.getAttribute("documentid"),e.target.getAttribute("subfolderid")); // the list must know the details container
                          }, false);


                          li.appendChild(documentCell);
                          li.appendChild(documentText);
                          li.appendChild(anchorSposta);
                      });

                }

        }

        this.reset = function() {
             this.divContainer.style.visibility = "hidden";
        }
   }


   function ChoicesList(  _messagecell){
      this.messageCell = _messagecell;

      this.show = function (documentid,sfid) {
          var self = this;
          makeCall("GET", "GetFoldersAndSubFolders", null,
            function(req) {
                    if (req.readyState == 4) {
                      var message = req.responseText;
                      if (req.status == 200) {
                        self.update(JSON.parse(req.responseText),sfid); // self visible by
                        // closure
                      } else {
                        self.messageCell.textContent = message;
                      }
                    }
                  })

      }

      this.update = function(subfolderList,subfolderid){
          var l = subfolderList.length,
          row,li,foldercell,subfoldercell, linkcell, anchor;

          if (l == 0) {
              messageCell.textContent = "No folders yet!";
            } else {
                var self = this;
                self.messageCell.innerHTML="";
                subfolderList.forEach(list => {
                row = document.createElement("p");
                row.textContent = list[0].folderName;
                    foldercell = document.createElement("ul");
                   // foldercell.textContent = list[0].folderName;
                    self.messageCell.appendChild(row);
                    self.messageCell.appendChild(foldercell);

                    list.forEach(subfolder =>{
                             li = document.createElement("li");
                             foldercell.appendChild(li);

                             if (subfolder.id !== parseInt(subfolderid)){
//                                 anchor = document.createElement("a");
//                                 li.appendChild(anchor);
//                                 anchor.textContent = subfolder.name;
//                                 anchor.setAttribute('subfolderid', subfolder.id);
                                 
                                 li.textContent = subfolder.name;
                             }
                             else {
                                 li.textContent = subfolder.name;
                                 li.setAttribute("class", "democlass"); 
                             }



                            // anchor.appendChild(subfoldercell);
                         });

                });

            }

      }



   }


   })();
