package it.polimi.tiw.projects.beans;

import java.sql.Date;

public class Folder {
	private String folderName;
	private Date dateOfFolder;

	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String un) {
		folderName = un;
	}
	
	public Date getDate() {
		return dateOfFolder;
	}

	public void setDate(Date date) {
		this.dateOfFolder = date;
	}

}
