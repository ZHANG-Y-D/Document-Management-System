package it.polimi.tiw.projects.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

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
import it.polimi.tiw.projects.beans.SubFolder;
import it.polimi.tiw.projects.dao.DocumentDAO;
import it.polimi.tiw.projects.dao.SubFolderDAO;
import it.polimi.tiw.projects.utils.ConnectionHandler;

@WebServlet("/GetListDocuments")
public class GetListDocuments extends HttpServlet{
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	
	public GetListDocuments() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	
	public void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
		
		String subFolderName = req.getParameter("subFolderName");
		String folderName = req.getParameter("folderName");
		if (subFolderName != null && folderName != null) {
			
			DocumentDAO dDao = new DocumentDAO(connection);
			List<Document> documents;
			try {
				
				documents = dDao.findAllDocumentsBySubFolderAndFolderName(subFolderName, folderName);
				
			} catch (SQLException e) {
				
				e.printStackTrace();
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Not possible to recover missions");
				return;
			}
			
			String json = new Gson().toJson(documents);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(json);
			
		} else {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("505 Bad topic ID");
			return;
		}
	}
		
		
	}
	

