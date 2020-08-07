package it.polimi.tiw.projects.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringEscapeUtils;

import it.polimi.tiw.projects.beans.User;
import it.polimi.tiw.projects.dao.UserDAO;
import it.polimi.tiw.projects.utils.ConnectionHandler;

@WebServlet("/Register")
@MultipartConfig
public class Register extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;

	public Register() {
		super();
	}

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// obtain and escape params
		String usrn = null;
		String pwd = null;
		String confirmpwd = null;
		String email = null;
		
		usrn = StringEscapeUtils.escapeJava(request.getParameter("username"));
		pwd = StringEscapeUtils.escapeJava(request.getParameter("pwd"));
		confirmpwd = StringEscapeUtils.escapeJava(request.getParameter("confirmpwd"));
		email = StringEscapeUtils.escapeJava(request.getParameter("email"));
		
		if (usrn == null || pwd == null || confirmpwd == null || email == null
				|| usrn.isEmpty() || pwd.isEmpty() || confirmpwd.isEmpty() || email.isEmpty()) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Credentials must be not null");
			return;
		}
		
		if (!pwd.equals(confirmpwd)) {
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			response.getWriter().println("Password and confirm password must be the same.");
			return;
		}
		
		// insert into database
		UserDAO userDao = new UserDAO(connection);
		String resultString = null;
		try {
			resultString = userDao.insertForRegister(usrn, pwd, email);
			if (resultString.contains("OK")) {
				response.setStatus(HttpServletResponse.SC_OK);
			}else {
				response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
				if (resultString.contains("Duplicate")) { 
					// Duplicate entry. The user name has been registered.
					response.getWriter().println("The user name has been registered.");
				}else if(resultString.contains("mailchck")){
					// Check constraint 'mailchck' is violated,
					// So the syntactic of the email address is not valid.
					response.getWriter().println("The syntactic of the email address is not valid.");
				}else {
					response.getWriter().println(resultString);
				}
			}
		} catch (SQLException e) {
			
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Internal server error, retry later. "+e.getMessage());
			return;
		}
	}

	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
