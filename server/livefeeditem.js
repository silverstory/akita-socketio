class Livefeeditem {
  constructor(profileid, name, gender,
    imagepath, distinction, gate) {
    this._profileid = profileid;
    this._name = name;
    this._gender = gender;
    this._imagepath = imagepath;
    this._distinction = distinction;
    this._gate = gate;
  }

  get profileid() {
    return this._profileid;
  }
  set profileid(newprofileid) {
    this._profileid = newprofileid;
  }
  get name() {
    return this._name;
  }
  set name(newname) {
    this._name = newname;
  }
  get gender() {
    return this._gender;
  }
  set gender(newgender) {
    this._gender = newgender;
  }
  get imagepath() {
    return this._imagepath;
  }
  set imagepath(newimagepath) {
    this._imagepath = newimagepath;
  }
  get distinction() {
    return this._distinction;
  }
  set distinction(newdistinction) {
    this._distinction = newdistinction;
  }
  get gate() {
    return this._gate;
  }
  set gate(newgate) {
    this._gate = newgate;
  }

}