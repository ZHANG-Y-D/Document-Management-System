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

@WebServlet("/RemoveDocument")
public class RemoveDocument extends HttpServlet {
	
	
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	
	public RemoveDocument() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	public void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
		
		String documentName = req.getParameter("DocumentName");
		String subFolderName = req.getParameter("SubFolderName");
		String folderName = req.getParameter("FolderName"); 
		
		
		if (documentName != null &&
				subFolderName != null &&
						folderName != null) {
			DocumentDAO dDao = new DocumentDAO(connection);
			try {
				
				dDao.removeDocument(documentName, subFolderName, folderName);
				response.setStatus(HttpServletResponse.SC_OK);
			} catch ( SQLException e ) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Database access failed");
			}
		} else {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Bad topic ID");
		}
	}

}
