package it.polimi.tiw.projects.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import com.google.gson.Gson;

import it.polimi.tiw.projects.beans.Document;
import it.polimi.tiw.projects.beans.Folder;
import it.polimi.tiw.projects.beans.SubFolder;
import it.polimi.tiw.projects.dao.DocumentDAO;
import it.polimi.tiw.projects.dao.FolderDAO;
import it.polimi.tiw.projects.dao.SubFolderDAO;
import it.polimi.tiw.projects.utils.ConnectionHandler;

@WebServlet("/GetDetails")
public class GetDetails extends HttpServlet{
	
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	
	public GetDetails() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	
	public void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
		
//		String documentName = req.getParameter("DocumentName");
//		String subFolderName = req.getParameter("SubFolderName");
//		String folderName = req.getParameter("FolderName");
//		
//		if (documentName != null &&
//				subFolderName != null &&
//						folderName != null) {
//			DocumentDAO dDao = new DocumentDAO(connection);
//			Document document;
//			try {
//				document = dDao.findDocument(documentName,subFolderName,folderName);			
//			} catch ( SQLException e ) {
//				res.sendError(500, "Database access failed");
//			}
//			String json = new Gson().toJson(subfolders);
//			response.setContentType("application/json");
//			response.setCharacterEncoding("UTF-8");
//			response.getWriter().write(json);
//		} else {
//			res.sendError(505, "Bad topic ID");
//		}
		
	}
	
	
}
