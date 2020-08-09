package it.polimi.tiw.projects.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import it.polimi.tiw.projects.beans.Document;
import it.polimi.tiw.projects.beans.SubFolder;
import it.polimi.tiw.projects.dao.DocumentDAO;
import it.polimi.tiw.projects.dao.SubFolderDAO;
import it.polimi.tiw.projects.utils.ConnectionHandler;

@WebServlet("/DoSposta")
public class DoSposta extends HttpServlet {
	
	
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	
	public DoSposta() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	public void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
		
		String fromDocumentName = req.getParameter("FromDocumentName");
		String fromSubFolderName = req.getParameter("FromSubFolderName");
		String fromFolderName = req.getParameter("FromFolderName"); 
		String toSubFolderName = req.getParameter("ToSubFolderName");
		String toFolderName = req.getParameter("ToFolderName");
		
		if (fromDocumentName != null &&
				fromSubFolderName != null &&
						fromFolderName != null) {
			DocumentDAO dDao = new DocumentDAO(connection);
			SubFolderDAO fDao = new SubFolderDAO(connection);
		
			try {
				List<String> fromDocument = new ArrayList<String>();
				List<String> toSubFolder = new ArrayList<String>();
				
				fromDocument.add(fromDocumentName);
				fromDocument.add(fromSubFolderName);
				fromDocument.add(fromFolderName);
				toSubFolder.add(toSubFolderName);
				toSubFolder.add(toFolderName);
				
				// Find if the newName is already existed and rename it
				if(dDao.findDocument(fromDocumentName, toSubFolderName, toFolderName).getDocumentName() != null) {
					String newName = fromDocumentName + "(1)";
					while(dDao.findDocument(newName, toSubFolderName, toFolderName).getDocumentName() != null) {
						newName = newName + "(1)";
						System.out.println(newName);
					}
					toSubFolder.add(0, newName);
				}
				dDao.moveDocument(fromDocument, toSubFolder);
			} catch ( SQLException e ) {
//				res.sendError(500, "Database access failed");
			}
		} else {
//			res.sendError(505, "Bad topic ID");
		}
	}
	
	
	
	
	
	

}
