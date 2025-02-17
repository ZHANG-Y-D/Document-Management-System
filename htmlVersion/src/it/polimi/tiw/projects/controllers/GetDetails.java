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
import javax.servlet.http.HttpSession;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import it.polimi.tiw.projects.beans.Document;
import it.polimi.tiw.projects.beans.Folder;
import it.polimi.tiw.projects.beans.SubFolder;
import it.polimi.tiw.projects.dao.DocumentDAO;
import it.polimi.tiw.projects.dao.FolderDAO;
import it.polimi.tiw.projects.dao.SubFolderDAO;

@WebServlet("/GetDetails")
public class GetDetails extends HttpServlet{
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	private TemplateEngine templateEngine;
	
	public GetDetails() {
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
		  
			String documentName = req.getParameter("DocumentName");
			HttpSession session = req.getSession();
			
			if (documentName != null ) {
				
				List<Document> documents = (List<Document>) session.getAttribute("lastDocuments");
				
				if(documents == null) {res.sendError(505, "no session");}
				
				ServletContext servletContext = getServletContext();	
				final WebContext ctx = new WebContext(req, res, servletContext, req.getLocale());
				
				for(Document d : documents) {
					if(d.getDocumentName().equals(documentName)) {
						ctx.setVariable("document", d);
						break;
					}
				}
				//ctx.setVariable("documents", documents);
				String path = "documentDetails.html";
				templateEngine.process(path, ctx, res.getWriter());
			} else {
				res.sendError(505, "Bad topic ID");
			}
			
		}
		

	
	
	
	
//	public void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
//		
//		String documentName = req.getParameter("DocumentName");
//		String subFolderName = req.getParameter("SubFolderName");
//		String folderName = req.getParameter("FolderName");
//		
//		if (documentName != null && subFolderName != null && folderName != null) {
//			DocumentDAO dDao = new DocumentDAO(connection);
//			Document document;
//			try {
//				document = dDao.findDocument(documentName,subFolderName,folderName);
//				String path = "documentDetails.html";
//				ServletContext servletContext = getServletContext();
//				final WebContext ctx = new WebContext(req, res, servletContext, req.getLocale());
//				ctx.setVariable("document", document);
//				templateEngine.process(path, ctx, res.getWriter());
//				
//			} catch ( SQLException e ) {
//				res.sendError(500, "Database access failed");
//			}
//		} else {
//			res.sendError(505, "Bad topic ID");
//		}
//		
//	}
	
}
