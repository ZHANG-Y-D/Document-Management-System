package it.polimi.tiw.projects.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import it.polimi.tiw.projects.beans.SubFolder;

public class SubFolderDAO {
	
	
	private Connection con;

	public 	SubFolderDAO(Connection connection) {
		this.con = connection;
	}
	
	public List<SubFolder> findSubfoldersByFolderName (String name) throws SQLException{
		
		List<SubFolder> sfolders = new ArrayList<SubFolder>();
		String query = "SELECT * FROM subfolder WHERE namefolder = ?";
		ResultSet result = null;
		PreparedStatement pstatement = null;
		
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setString(1,name);
			result = pstatement.executeQuery();
			while (result.next()) {
				SubFolder sf = new SubFolder();
				sf.setId(result.getInt("idsubfolder"));
				sf.setName(result.getString("name"));
				sf.setDate(result.getDate("date"));
				sf.setFolderName(result.getString("namefolder"));
				
				sfolders.add(sf);
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
		
		return sfolders;
	}
	
	public SubFolder findSubFolderById(int sfolderId) throws SQLException{
		
		SubFolder sf= new SubFolder();
		String query = "SELECT * FROM subfolder WHERE idsubfolder = ?";
		ResultSet result = null;
		PreparedStatement pstatement = null;
		
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setInt(1, sfolderId);
			result = pstatement.executeQuery();
			while (result.next()) {
	
				sf.setId(result.getInt("idsubfolder"));
				sf.setName(result.getString("name"));
				sf.setDate(result.getDate("date"));
				sf.setFolderName(result.getString("namefolder"));
				
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
		
		return sf;
	}

}
