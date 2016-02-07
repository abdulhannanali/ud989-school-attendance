/*
 * app.js
 * Author(s): ["Hannan Ali"] 
 * Udacity School Attendance app.js file
 * 
 * NOTES: I am using the burn-it method because after reaing that code
 * i have come to the conclusion that code is too bad to fix
 * 
 * In the attendanceView I am using an id property in the .data() for every checkbox
 * and the student row in order to update the id.
 * This is saving the internal event bindings using closure for every element
 * but that approach is cool too.
 * I just update the missed col of the student id in case a user checks a property
 * 
 * Concerned about the this.countMissedDays function in the object attendanceView
 * because it contains logic and that logic also deals with View. So I created a function in the
 * view but now the problem is should I push it in Octopus.
 * 
 * I suppose it should go in the Octopus because it depends on the model and we are only 
 * concerned with counting missed days and not how are they arranged in the view
 * in this way we can generalize.
 * More stuff will be clear on looking over some examples that deal with it.
 */
 // I am using MOV (Model Octopus View about which I learned in Udacity for this app)
 // Model Octopus View will give me a really good separation of concern one which I really
 // need at this time
 

 // Model for the Attendance Sheet
 var attendanceModel = {
 	getAttendance: function () {
 		return this.attendance
 	},
 	updateStudent: function (studentId, data) {
 		this.attendance[studentId] = data
 		this.localStoragePersist()
 	},
 	updateStudentDay: function (studentId, day, attend) {
 		this.attendance.students[studentId].days[day] = attend ? true: false
 		this.localStoragePersist()
 	},
 	localStorageCheck: function () {
 		if (!localStorage.attendance) {
 			this.localStorageInit()
 			console.log("creating a localStorage [Object] localStorage.attendance for this")
 		}
 	},
 	localStoragePersist: function () {
 		try {
 			var attendanceData = JSON.stringify(this.attendance)
 			localStorage.attendance = attendanceData
 		}
 		catch (error) {
 			console.log("error occured while persisting data in the localStorage")
 			console.error(error)
 		}
 	},
 	// if localStorage for attendance doesn't exist already
 	localStorageInit: function () {
 		var days = 12
 		var attendanceData = {}
 		var studentsData = [
 			{
 				name: "Slappy the Frog"
 			},
 			{
 				name: "Lilly the Lizard"
 			},
 			{
 				name: "Paulrus the Walrus"
 			},
 			{
 				name: "Gregory the Goat"
 			},
 			{
 				name: "Adam the Anaconda"
 			}
 		]

 		var daysArray = []
 		for (var i = 0; i < 12; i++) {
 			daysArray[i] = false
 		}

 		studentsData = studentsData.map(function (value, index, array ) {
 			value.days = daysArray
 			return value
 		})

 		attendanceData.students = studentsData
 		attendanceData.totalDays = days
 		attendanceData.totalStudents = 5

 		localStorage.attendance = JSON.stringify(attendanceData)
 	},
 	init: function () {
 		this.localStorageCheck()
 		this.attendance = JSON.parse(localStorage.attendance)

 	}
 }


 // octopus for managing the following
 // Models
 // - attendanceModel
 // Views
 // - attendanceView
 var attendanceOctopus = {
 	getAttendance: function () {
 		return attendanceModel.getAttendance()
 	},
 	init: function () {
 		attendanceModel.init()
 		attendanceView.init()
 	},
 	updateAttendance: function (studentId, day, attend) {
 		attendanceModel.updateStudentDay(studentId, day, attend)
 		attendanceView.updateMissedDays(studentId)
 	},
 	countMissedDays: function (studentId) {
 		var days = attendanceModel.getAttendance().students[studentId].days
 		return days.reduce(function (prev, current) {
 			return !current ? prev + 1 : prev
 		}, 0)
 	}
 }



 var attendanceView = {
 	init: function () {
 		this.attendanceView = $("#attendanceView")
 		this.render()
 	},
 	render: function () {
 		this.attendanceView.empty()
 		this.attendance = attendanceOctopus.getAttendance()
		var students = [] 		
 		this.attendance.students.forEach(function (student, studentId) {
 			var tr = $("<tr>").addClass("student").data("studentId", studentId)
 			tr.append($("<td>").addClass("name-col").text(student.name))
 			student.days.forEach(function (attendance, id) {
 				tr.append($("<td>").addClass("attend-col")
 							.append($("<input>")
 										.attr("type", "checkbox")
 										.prop("checked", attendance)
 										.data("id", id)))
 			})
 			var missedDays = attendanceOctopus.countMissedDays(studentId)
	 		tr.append($("<td>").addClass("missed-col").text(missedDays))
 			students.push(tr)
 		}.bind(this))
 		this.attendanceView.append(students)
 		$("input").on("change", this.changeAttendance)
 	},
 	changeAttendance: function (event) {
 		var studentId = $($(this).parents()[1]).data("studentId")
 		var id = $(this).data("id")
 		attendanceOctopus.updateAttendance(studentId, id, $(this).prop("checked"))
 	},
 	updateMissedDays: function (studentId) {
 		var missedCol = this.attendanceView.find(".missed-col")[studentId]
 		this.attendance = attendanceOctopus.getAttendance()

 		missedCol.textContent = attendanceOctopus.countMissedDays(studentId)
 	}
 }


attendanceOctopus.init()
