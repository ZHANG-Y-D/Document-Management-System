package it.polimi.tiw.projects.beans;

import java.sql.Date;

public class SubFolder extends Folder {

	private String subFolderName;
	private String folderName;
	private Date date;
	
	public String getSubFolderName() {
		return subFolderName;
	}

	public void setSubFolderName(String a) {
		subFolderName = a;
	}
	
	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String a) {
		folderName = a;
	}
	
	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

}
