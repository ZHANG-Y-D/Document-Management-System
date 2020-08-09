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

import com.google.gson.Gson;

import it.polimi.tiw.projects.utils.ConnectionHandler;
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
	
	public GetFoldersAndSubFolders() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	
	
	public void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
		FolderDAO fDao = new FolderDAO(connection);
		List<Folder> folders;
		List<ArrayList<SubFolder>> subfolders = new ArrayList<ArrayList<SubFolder>>();
		SubFolderDAO sfDao = new SubFolderDAO(connection);
		
		
		try {
			
			folders = fDao.findAllFolders();
			
			for(Folder f: folders){
				List<SubFolder> listSubFolder;
				listSubFolder = sfDao.findAllSubfoldersByFolderName(f.getFolderName());
				subfolders.add((ArrayList<SubFolder>) listSubFolder);
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover folders");
			return;
		}
		
		String json = new Gson().toJson(subfolders);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
		
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
