package it.polimi.tiw.projects.beans;

import java.sql.Date;

public class Folder {
	private String name;
	private Date date;
	private int id;
	
	public int getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setId(int i) {
		id = i;
	}

	public void setName(String un) {
		name = un;
	}
	
	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

}
