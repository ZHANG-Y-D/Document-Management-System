package it.polimi.tiw.projects.beans;

import java.sql.Date;

public class SubFolder extends Folder {

	private String subFolderName;
	private String folderNameOfSubFolder;
	private Date dateOfSubFolder;
	
	public String getSubFolderName() {
		return subFolderName;
	}

	public void setSubFolderName(String a) {
		subFolderName = a;
	}
	
	public String getFolderName() {
		return folderNameOfSubFolder;
	}

	public void setFolderName(String a) {
		folderNameOfSubFolder = a;
	}
	
	public Date getDate() {
		return dateOfSubFolder;
	}

	public void setDate(Date date) {
		this.dateOfSubFolder = date;
	}

}
