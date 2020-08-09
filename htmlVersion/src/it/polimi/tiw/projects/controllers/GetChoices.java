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

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import it.polimi.tiw.projects.beans.Document;
import it.polimi.tiw.projects.beans.SubFolder;
import it.polimi.tiw.projects.dao.DocumentDAO;
import it.polimi.tiw.projects.dao.SubFolderDAO;

@WebServlet("/GetChoices")
public class GetChoices extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	private TemplateEngine templateEngine;
	
	public GetChoices() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public void init() throws ServletException {
		ServletContext servletContext = getServletContext();
		ServletContextTemplateResolver templateResolver = new ServletContextTemplateResolver(servletContext);
		templateResolver.setTemplateMode(TemplateMode.HTML);
		this.templateEngine = new TemplateEngine();
		this.templateEngine.setTemplateResolver(templateResolver);
		templateResolver.setSuffix(".html");
		try {
			
			String driver = servletContext.getInitParameter("dbDriver");
			String url = servletContext.getInitParameter("dbUrl");
			String user = servletContext.getInitParameter("dbUser");
			String password = servletContext.getInitParameter("dbPassword");
			Class.forName(driver);
			connection = DriverManager.getConnection(url, user, password);
		} catch (ClassNotFoundException e) {
			throw new UnavailableException("Can't load database driver");
		} catch (SQLException e) {
			throw new UnavailableException("Couldn't get db connection");
		}
	}
	
	
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
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
				SubFolder subFolder = fDao.findSubFolderBySubFoldAndFolderName(toSubFolderName, toFolderName);
				List<Document> documents = dDao.findAllDocumentsBySubFolderAndFolderName(toSubFolderName, toFolderName);
				String path = "documents.html";
				ServletContext servletContext = getServletContext();
				final WebContext ctx = new WebContext(req, res, servletContext, req.getLocale());
				ctx.setVariable("documents", documents);
				ctx.setVariable("subfolder", subFolder);
				templateEngine.process(path, ctx, res.getWriter());

			} catch (

			SQLException e) {
				res.sendError(500, "Database access failed");
			}
		} else {
			res.sendError(505, "Bad topic ID");
		}
	}
	
	
	
	
	
	

}
