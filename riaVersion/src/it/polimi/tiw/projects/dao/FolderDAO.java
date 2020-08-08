package it.polimi.tiw.projects.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import it.polimi.tiw.projects.beans.Folder;

public class FolderDAO {
	
	private Connection con;

	public 	FolderDAO(Connection connection) {
		this.con = connection;
	}
	
	public List<Folder> findAllFolders() throws SQLException{
		
		List<Folder> folders = new ArrayList<Folder>();
		String query = "SELECT * FROM folder";
		ResultSet result = null;
		PreparedStatement pstatement = null;
		try {
			pstatement = con.prepareStatement(query);
			result = pstatement.executeQuery();
			while (result.next()) {
				Folder f = new Folder();
				f.setName(result.getString("name"));
				f.setDate(result.getDate("date"));
				folders.add(f);
			}
		} catch (SQLException e) {
			throw new SQLException(e);

		} finally {
			try {
				result.close();
			} catch (Exception e1) {
				throw new SQLException("Cannot close result");
			}
			try {
				pstatement.close();
			} catch (Exception e1) {
				throw new SQLException("Cannot close statement");
			}
		}
		
		return folders;
	}

}
