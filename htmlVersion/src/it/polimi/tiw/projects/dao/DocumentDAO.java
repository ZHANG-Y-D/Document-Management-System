package it.polimi.tiw.projects.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import it.polimi.tiw.projects.beans.Document;

public class DocumentDAO {
	
	private Connection con;
	
	public DocumentDAO(Connection connection) {
		this.con = connection;
	}
	
	public List<Document> findAllDocumentsBySubFolderAndFolderName (String subFolderName, String folderName) throws SQLException{
		
		List<Document> documents = new ArrayList<Document>();
		String query = "SELECT * FROM Document WHERE SubFolderName = ? and FolderName = ?";
		ResultSet result = null;
		PreparedStatement pstatement = null;
		
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setString(1, subFolderName);
			pstatement.setString(2, folderName);
			result = pstatement.executeQuery();
			while (result.next()) {
				Document d = new Document();
				d.setDocumentName(result.getString("DocumentName"));
				d.setSubFolderName(result.getString("SubFolderName"));
				d.setFolderName(result.getString("FolderName"));
				d.setDate(result.getDate("Date"));
				d.setSummery(result.getString("Summary"));
				d.setType(result.getString("Type"));
				documents.add(d);
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
		return documents;
	}
	
	public Document findDocument (String documentName, String subFolderName, String folderName) throws SQLException{
			
			Document document = new Document();
			String query = "SELECT * FROM Document WHERE DocumentName = ? and SubFolderName = ? and FolderName = ?";
			ResultSet result = null;
			PreparedStatement pstatement = null;
			
			try {
				pstatement = con.prepareStatement(query);
				pstatement.setString(1, documentName);
				pstatement.setString(2, subFolderName);
				pstatement.setString(3, folderName);
				result = pstatement.executeQuery();
				while (result.next()) {
					document.setDocumentName(result.getString("DocumentName"));
					document.setSubFolderName(result.getString("SubFolderName"));
					document.setFolderName(result.getString("FolderName"));
					document.setDate(result.getDate("Date"));
					document.setSummery(result.getString("Summary"));
					document.setType(result.getString("Type"));
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
			
			return document;
		}

	public void moveDocument(List<String> documentNameList, List<String> destinationSubFolderAndFolder)  throws SQLException{
		
		String query = 
				"UPDATE Document SET SubFolderName = ?, FolderName = ? WHERE DocumentName = ? and SubFolderName = ? and FolderName = ?";
		PreparedStatement pstatement = null;
		try {
			pstatement = con.prepareStatement(query);
			pstatement.setString(1, destinationSubFolderAndFolder.get(0));
			pstatement.setString(2, destinationSubFolderAndFolder.get(1));
			pstatement.setString(3, documentNameList.get(0));
			pstatement.setString(4, documentNameList.get(1));
			pstatement.setString(5, documentNameList.get(2));
			pstatement.executeUpdate();
		} catch (SQLException e) {
			// If the file already exists, automatically rename
			String newName = documentNameList.get(0) + "(1)";
			
			String queryNew = 
					"UPDATE Document SET DocumentName = ?, SubFolderName = ?, FolderName = ? WHERE DocumentName = ? and SubFolderName = ? and FolderName = ?";
			PreparedStatement pstatementNew = null;
			try {
				pstatementNew = con.prepareStatement(queryNew);
				pstatementNew.setString(1, newName);
				pstatementNew.setString(2, destinationSubFolderAndFolder.get(0));
				pstatementNew.setString(3, destinationSubFolderAndFolder.get(1));
				pstatementNew.setString(4, documentNameList.get(0));
				pstatementNew.setString(5, documentNameList.get(1));
				pstatementNew.setString(6, documentNameList.get(2));
				pstatementNew.executeUpdate();
			}catch (SQLException exc) {
				try {
					pstatement.close();
				} catch (Exception e1) {

				}
			}
			
		}finally {
			try {
				pstatement.close();
			} catch (Exception e1) {

			}
		}
		
	}
	

	
	
	
	
	
	

}
