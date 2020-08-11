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
	
	public List<SubFolder> findAllSubfoldersByFolderName (String folderName) throws SQLException{
		
		List<SubFolder> sfolders = new ArrayList<SubFolder>();
		String query = "SELECT * FROM SubFolder where FolderName = ?";
		ResultSet result = null;
		PreparedStatement pstatement = null;
		
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setString(1, folderName);
			result = pstatement.executeQuery();
			while (result.next()) {
				SubFolder sf = new SubFolder();
				sf.setSubFolderName(result.getString("SubFolderName"));
				sf.setFolderName(result.getString("FolderName"));
				sf.setDate(result.getDate("date"));				
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
	
//	public SubFolder findSubFolderBySubFoldAndFolderName(String subFolderName, String folderName) throws SQLException{
//		
//		SubFolder sf= new SubFolder();
//		String query = "SELECT * FROM SubFolder where SubFolderName = ? and FolderName = ?";
//		ResultSet result = null;
//		PreparedStatement pstatement = null;
//		
//		try {
//			pstatement = con.prepareStatement(query);
//			pstatement.setString(1, subFolderName);
//			pstatement.setString(2, folderName);
//			result = pstatement.executeQuery();
//			while (result.next()) {
//				sf.setSubFolderName(result.getString("SubFolderName"));
//				sf.setFolderName(result.getString("FolderName"));
//				sf.setDate(result.getDate("Date"));	
//			}
//		} catch (SQLException e) {
//			throw new SQLException(e);
//
//		} finally {
//			try {
//				result.close();
//			} catch (Exception e1) {
//				throw new SQLException("Cannot close result");
//			}
//			try {
//				pstatement.close();
//			} catch (Exception e1) {
//				throw new SQLException("Cannot close statement");
//			}
//		}
//		
//		return sf;
//	}

}
