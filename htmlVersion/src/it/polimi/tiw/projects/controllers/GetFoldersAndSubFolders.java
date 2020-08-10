package it.polimi.tiw.projects.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
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

@WebServlet("/GetFoldersAndSubFolders")
public class GetFoldersAndSubFolders extends HttpServlet{
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	private TemplateEngine templateEngine;
	
	public GetFoldersAndSubFolders() {
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
		FolderDAO fDao = new FolderDAO(connection);
		List<Folder> folders;
		Map <Folder, List<SubFolder>> folderAndSubFolders = new HashMap <Folder, List<SubFolder>>();
		SubFolderDAO sfDao = new SubFolderDAO(connection);
		List<SubFolder> subfolders;
		
		
		try {
			
			String documentName = req.getParameter("DocumentName");
			String subFolderName = req.getParameter("SubFolderName");
			String folderName = req.getParameter("FolderName");
			String path;
			ServletContext servletContext = getServletContext();
			final WebContext ctx = new WebContext(req, res, servletContext, req.getLocale());
			
			

			HttpSession session = req.getSession(true); // if session does not exist, create one 
			if (session.isNew()) {
			       
			       folders = fDao.findAllFolders();
				
				   for(Folder f: folders){
					   subfolders = sfDao.findAllSubfoldersByFolderName(f.getFolderName());
				   	   folderAndSubFolders.put(f,subfolders);
				   }
				   
				   session.setAttribute("folders", folders);
				   session.setAttribute("folderAndSubFolders", folderAndSubFolders);
				   ctx.setVariable("fsubfolders", folderAndSubFolders);
				   path = "home.html";
				   
		    } else // session already existing
			       { 	
					folders = (List<Folder>) session.getAttribute("folders");
					Map <Folder, List<SubFolder>> folderAndSubfolders = (Map<Folder, List<SubFolder>>) session.getAttribute("folderAndSubFolders");
					
					ctx.setVariable("fsubfolders", folderAndSubfolders);
					if(documentName == null ||subFolderName == null ||folderName == null) path = "home.html";
					else { //show folders to move
						DocumentDAO dDao = new DocumentDAO(connection);
						Document document = dDao.findDocument(documentName, subFolderName, folderName);
						
						session.setAttribute("FromDocumentName", documentName);
						session.setAttribute("FromSubFolderName",subFolderName);
						session.setAttribute("FromFolderName", folderName);
						
						ctx.setVariable("document", document);
						path = "choices.html";}
			       }

			
			ctx.setVariable("folders", folders);
			templateEngine.process(path, ctx, res.getWriter());
			
			} catch (SQLException e) {
					res.sendError(500, "Database access failed");
		}
		
	}
	
	public void destroy() {
		try {
			if (connection != null) {
				connection.close();
			}
		} catch (SQLException sqle) {
		}
	}

	
	
}
