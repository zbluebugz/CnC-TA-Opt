// ==UserScript==
	// @version       1.0.6
	// @name          CnC:TA CnCTAOpt Link Button (non-flash)
	// @namespace     http://cnctaopt.com/
	// @icon          http://cnctaopt.com/favicon.ico
	// @description   Creates a "CnCTAOpt" button when selecting a base in Command & Conquer: Tiberium Alliances. The share button takes you to http://cnctaopt.com/ and fills in the selected base information so you can analyze or share the base.
	// @author        zbluebugz
	// @include       http*://*alliances*.com/*
	// @include       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
	// @grant         GM_log
	// @grant         GM_setValue
	// @grant         GM_getValue
	// @grant         GM_registerMenuCommand
	// @grant         GM_xmlhttpRequest
	// @grant         GM_updatingEnabled
	// @grant         unsafeWindow
	// @contributor   PythEch (http://userscripts.org/users/220246)
	// @contributor   jerbri (http://userscripts.org/users/507954)
	// @contributor   leo7044 (https://github.com/leo7044)
	// @contributor   zbluebugz (https://github.com/zbluebugz)
	// ==/UserScript==
	/*
	2021-01-07: zbluebugz added fa's missing infected camp units (e.g. infected barracks); fix bug with offense faction not 100% correct when viewing infected camps;
	2019-11-13: zbluebugz added world id & name to URL
	2019-11-06: zbluebugz added base coords to URL
	2019-06-24: zbluebugz changed parameter separator symbol from pipe to tilde
	2019-06-14: zbluebugz cloned from https://github.com/leo7044/CnC_TA/blob/master/CnC-Opt.user.js and adapted for cnctaop.com (non-flash).
	2018-06-05: leo7044 fixed it for new server-links
	2016-08-21: leo7044 fixed it for bases level 50+
	2016-05-17: leo7044 fixed it for Infected
	2013-03-03: Special thanks to jerbri for fixing this up so it worked again!
	2012-11-25: Special thanks to PythEch for fixing this up so it worked again!
	*/
	
	
	/*
	Start of CnCTAOpt Link Button
	- cloned from CNCOpt (version 2018.06.05)
	*/
	var scity = null;
	var tcity = null;
	var tbase = null;
	try {
		unsafeWindow.__cnctaopt_version = "1.0.1";
		(function () {
			var cnctaopt_main = function () {
				var defense_unit_map = {
					/* GDI Defense Units */
					"GDI_Wall": "w",
					"GDI_Cannon": "c",
					"GDI_Antitank Barrier": "t",
					"GDI_Barbwire": "b",
					"GDI_Turret": "m",
					"GDI_Flak": "f",
					"GDI_Art Inf": "r",
					"GDI_Art Air": "e",
					"GDI_Art Tank": "a",
					"GDI_Def_APC Guardian": "g",
					"GDI_Def_Missile Squad": "q",
					"GDI_Def_Pitbull": "p",
					"GDI_Def_Predator": "d",
					"GDI_Def_Sniper": "s",
					"GDI_Def_Zone Trooper": "z",
	
					/* Nod Defense Units */
					"NOD_Def_Antitank Barrier": "t",
					"NOD_Def_Art Air": "e",
					"NOD_Def_Art Inf": "r",
					"NOD_Def_Art Tank": "a",
					"NOD_Def_Attack Bike": "p",
					"NOD_Def_Barbwire": "b",
					"NOD_Def_Black Hand": "z",
					"NOD_Def_Cannon": "c",
					"NOD_Def_Confessor": "s",
					"NOD_Def_Flak": "f",
					"NOD_Def_MG Nest": "m",
					"NOD_Def_Militant Rocket Soldiers": "q",
					"NOD_Def_Reckoner": "g",
					"NOD_Def_Scorpion Tank": "d",
					"NOD_Def_Wall": "w",
	
					/* Forgotten Defense Units */
					"FOR_Wall": "w",
					"FOR_Barbwire_VS_Inf": "b",
					"FOR_Barrier_VS_Veh": "t",
					"FOR_Inf_VS_Inf": "g",
					"FOR_Inf_VS_Veh": "r",
					"FOR_Inf_VS_Air": "q",
					"FOR_Sniper": "n",
					"FOR_Mammoth": "y",
					"FOR_Veh_VS_Inf": "o",
					"FOR_Veh_VS_Veh": "s",
					"FOR_Veh_VS_Air": "u",
					"FOR_Turret_VS_Inf": "m",
					"FOR_Turret_VS_Inf_ranged": "a",
					"FOR_Turret_VS_Veh": "v",
					"FOR_Turret_VS_Veh_ranged": "d",
					"FOR_Turret_VS_Air": "f",
					"FOR_Turret_VS_Air_ranged": "e",
	
					/* Forgotten Defense Units 50+ */
					"FOR_Fortress_DEF_Sniper": "n",
					"FOR_Fortress_DEF_Inf_VS_Inf": "o",
					"FOR_Fortress_DEF_Veh_VS_Air": "u",
					"FOR_Fortress_DEF_Turret_VS_Inf": "m",
					"FOR_Fortress_DEF_Turret_VS_Veh": "v",
					"FOR_Fortress_DEF_Turret_VS_Air": "f",
					"FOR_Fortress_DEF_Turret_VS_Inf_ranged": "a",
					"FOR_Fortress_DEF_Turret_VS_Veh_ranged": "d",
					"FOR_Fortress_DEF_Turret_VS_Air_ranged": "e",
					"FOR_Fortress_DEF_Mammoth": "y",
	
					/* Forgotten Infected Defense Units */
					"FOR_GDI_Wall": "w",
					"FOR_GDI_Cannon": "c",
					"FOR_GDI_Antitank Barrier": "t",
					"FOR_GDI_Barbwire": "b",
					"FOR_GDI_Turret": "m",
					"FOR_GDI_Flak": "f",
					"FOR_GDI_Art Inf": "r",
					"FOR_GDI_Art Air": "e",
					"FOR_GDI_Art Tank": "a",
					"FOR_GDI_Def_APC Guardian": "g",
					"FOR_GDI_Def_Missile Squad": "q",
					"FOR_GDI_Def_Pitbull": "p",
					"FOR_GDI_Def_Predator": "d",
					"FOR_GDI_Def_Sniper": "s",
					"FOR_GDI_Def_Zone Trooper": "z",
					"FOR_NOD_Def_Antitank Barrier": "t",
					"FOR_NOD_Def_Art Air": "e",
					"FOR_NOD_Def_Art Inf": "r",
					"FOR_NOD_Def_Art Tank": "a",
					"FOR_NOD_Def_Attack Bike": "p",
					"FOR_NOD_Def_Barbwire": "b",
					"FOR_NOD_Def_Black Hand": "z",
					"FOR_NOD_Def_Cannon": "c",
					"FOR_NOD_Def_Confessor": "s",
					"FOR_NOD_Def_Flak": "f",
					"FOR_NOD_Def_MG Nest": "m",
					"FOR_NOD_Def_Militant Rocket Soldiers": "q",
					"FOR_NOD_Def_Reckoner": "g",
					"FOR_NOD_Def_Scorpion Tank": "d",
					"FOR_NOD_Def_Wall": "w",
					"": ""
				};
	
				var offense_unit_map = {
					/* GDI Offense Units */
					"GDI_APC Guardian": "g",
					"GDI_Commando": "c",
					"GDI_Firehawk": "f",
					"GDI_Juggernaut": "j",
					"GDI_Kodiak": "k",
					"GDI_Mammoth": "m",
					"GDI_Missile Squad": "q",
					"GDI_Orca": "o",
					"GDI_Paladin": "a",
					"GDI_Pitbull": "p",
					"GDI_Predator": "d",
					"GDI_Riflemen": "r",
					"GDI_Sniper Team": "s",
					"GDI_Zone Trooper": "z",
	
					/* Nod Offense Units */
					"NOD_Attack Bike": "b",
					"NOD_Avatar": "a",
					"NOD_Black Hand": "z",
					"NOD_Cobra": "r",
					"NOD_Commando": "c",
					"NOD_Confessor": "s",
					"NOD_Militant Rocket Soldiers": "q",
					"NOD_Militants": "m",
					"NOD_Reckoner": "k",
					"NOD_Salamander": "l",
					"NOD_Scorpion Tank": "o",
					"NOD_Specter Artilery": "p",
					"NOD_Venom": "v",
					"NOD_Vertigo": "t",
					"": ""
				};
	
				function findTechLayout(city) {
					for (var k in city) {
						//console.log(typeof(city[k]), "1.city[", k, "]", city[k])
						if ((typeof (city[k]) == "object") && city[k] && 0 in city[k] && 8 in city[k]) {
							if ((typeof (city[k][0]) == "object") && city[k][0] && city[k][0] && 0 in city[k][0] && 15 in city[k][0]) {
								if ((typeof (city[k][0][0]) == "object") && city[k][0][0] && "BuildingIndex" in city[k][0][0]) {
									return city[k];
								}
							}
						}
					}
					return null;
				}
	
				function findBuildings(city) {
					var cityBuildings = city.get_CityBuildingsData();
					for (var k in cityBuildings) {
						if (PerforceChangelist >= 376877) {
							if ((typeof (cityBuildings[k]) === "object") && cityBuildings[k] && "d" in cityBuildings[k] && "c" in cityBuildings[k] && cityBuildings[k].c > 0) {
								return cityBuildings[k].d;
							}
						} else {
							if ((typeof (cityBuildings[k]) === "object") && cityBuildings[k] && "l" in cityBuildings[k]) {
								return cityBuildings[k].l;
							}
						}
					}
				}
	
				function isOffenseUnit(unit) {
					return (unit.get_UnitGameData_Obj().n in offense_unit_map);
				}
	
				function isDefenseUnit(unit) {
					return (unit.get_UnitGameData_Obj().n in defense_unit_map);
				}
	
				function getUnitArrays(city) {
					var ret = [];
					for (var k in city) {
						if ((typeof (city[k]) == "object") && city[k]) {
							for (var k2 in city[k]) {
								if (PerforceChangelist >= 376877) {
									if ((typeof (city[k][k2]) == "object") && city[k][k2] && "d" in city[k][k2]) {
										var lst = city[k][k2].d;
										if ((typeof (lst) == "object") && lst) {
											for (var i in lst) {
												if (typeof (lst[i]) == "object" && lst[i] && "get_CurrentLevel" in lst[i]) {
													ret.push(lst);
												}
											}
										}
									}
								} else {
									if ((typeof (city[k][k2]) == "object") && city[k][k2] && "l" in city[k][k2]) {
										var lst = city[k][k2].l;
										if ((typeof (lst) == "object") && lst) {
											for (var i in lst) {
												if (typeof (lst[i]) == "object" && lst[i] && "get_CurrentLevel" in lst[i]) {
													ret.push(lst);
												}
											}
										}
									}
								}
							}
						}
					}
					return ret;
				}
	
				function getDefenseUnits(city) {
					var arr = getUnitArrays(city);
					for (var i = 0; i < arr.length; ++i) {
						for (var j in arr[i]) {
							if (isDefenseUnit(arr[i][j])) {
								return arr[i];
							}
						}
					}
					return [];
				}
	
				function getOffenseUnits(city) {
					var arr = getUnitArrays(city);
					for (var i = 0; i < arr.length; ++i) {
						for (var j in arr[i]) {
							if (isOffenseUnit(arr[i][j])) {
								return arr[i];
							}
						}
					}
					return [];
				}
	
	
				function cnctaopt_create() {
					console.log("CnCTAOpt Link Button v" + window.__cnctaopt_version + " loaded");
					var cnctaopt = {
						selected_base: null,
						keymap: {
							/* GDI Buildings */
							"GDI_Accumulator": "a",
							"GDI_Refinery": "r",
							"GDI_Trade Center": "u",
							"GDI_Silo": "s",
							"GDI_Power Plant": "p",
							"GDI_Construction Yard": "y",
							"GDI_Airport": "d",
							"GDI_Barracks": "b",
							"GDI_Factory": "f",
							"GDI_Defense HQ": "q",
							"GDI_Defense Facility": "w",
							"GDI_Command Center": "e",
							"GDI_Support_Art": "z",
							"GDI_Support_Air": "x",
							"GDI_Support_Ion": "i",
	
							/* Forgotten Buildings */
							"FOR_Silo": "s",
							"FOR_Refinery": "r",
							"FOR_Tiberium Booster": "b",
							"FOR_Crystal Booster": "v",
							"FOR_Trade Center": "u",
							"FOR_Defense Facility": "w",
							"FOR_Construction Yard": "y",
							"FOR_EVENT_Construction Yard": "y",
							"FOR_Harvester_Tiberium": "h",
							"FOR_Defense HQ": "q",
							"FOR_Harvester_Crystal": "n",
							/* FA's infected buildings (zbluebugz, 01/2021) */
							"FOR_EVENT_Construction_Yard": "y",
							"FOR_GDI_Command Center": "e",
							"FOR_GDI_Barracks": "a", // "b" = tib booster ...
							"FOR_GDI_Airport": "d",
							"FOR_GDI_Factory": "f",
							"FOR_NOD_Command Center": "e",
							"FOR_NOD_Barracks": "a",  // "b" = tib booster ...
							"FOR_NOD_Airport": "d",
							"FOR_NOD_Factory": "f",
	
							/* Nod Buildings */
							"NOD_Refinery": "r",
							"NOD_Power Plant": "p",
							"NOD_Harvester": "h",
							"NOD_Construction Yard": "y",
							"NOD_Airport": "d",
							"NOD_Trade Center": "u",
							"NOD_Defense HQ": "q",
							"NOD_Barracks": "b",
							"NOD_Silo": "s",
							"NOD_Factory": "f",
							"NOD_Harvester_Crystal": "n",
							"NOD_Command Post": "e",
							"NOD_Support_Art": "z",
							"NOD_Support_Ion": "i",
							"NOD_Accumulator": "a",
							"NOD_Support_Air": "x",
							"NOD_Defense Facility": "w",
							//"NOD_Tech Lab": "",
							//"NOD_Recruitment Hub": "X",
							//"NOD_Temple of Nod": "X",
	
							/* GDI Defense Units */
							"GDI_Wall": "w",
							"GDI_Cannon": "c",
							"GDI_Antitank Barrier": "t",
							"GDI_Barbwire": "b",
							"GDI_Turret": "m",
							"GDI_Flak": "f",
							"GDI_Art Inf": "r",
							"GDI_Art Air": "e",
							"GDI_Art Tank": "a",
							"GDI_Def_APC Guardian": "g",
							"GDI_Def_Missile Squad": "q",
							"GDI_Def_Pitbull": "p",
							"GDI_Def_Predator": "d",
							"GDI_Def_Sniper": "s",
							"GDI_Def_Zone Trooper": "z",
	
							/* Nod Defense Units */
							"NOD_Def_Antitank Barrier": "t",
							"NOD_Def_Art Air": "e",
							"NOD_Def_Art Inf": "r",
							"NOD_Def_Art Tank": "a",
							"NOD_Def_Attack Bike": "p",
							"NOD_Def_Barbwire": "b",
							"NOD_Def_Black Hand": "z",
							"NOD_Def_Cannon": "c",
							"NOD_Def_Confessor": "s",
							"NOD_Def_Flak": "f",
							"NOD_Def_MG Nest": "m",
							"NOD_Def_Militant Rocket Soldiers": "q",
							"NOD_Def_Reckoner": "g",
							"NOD_Def_Scorpion Tank": "d",
							"NOD_Def_Wall": "w",
	
							/* Forgotten Defense Units */
							"FOR_Wall": "w",
							"FOR_Barbwire_VS_Inf": "b",
							"FOR_Barrier_VS_Veh": "t",
							"FOR_Inf_VS_Inf": "g",
							"FOR_Inf_VS_Veh": "r",
							"FOR_Inf_VS_Air": "q",
							"FOR_Sniper": "n",
							"FOR_Mammoth": "y",
							"FOR_Veh_VS_Inf": "o",
							"FOR_Veh_VS_Veh": "s",
							"FOR_Veh_VS_Air": "u",
							"FOR_Turret_VS_Inf": "m",
							"FOR_Turret_VS_Inf_ranged": "a",
							"FOR_Turret_VS_Veh": "v",
							"FOR_Turret_VS_Veh_ranged": "d",
							"FOR_Turret_VS_Air": "f",
							"FOR_Turret_VS_Air_ranged": "e",
	
							/* Forgotten Defense Units 50+ */
							"FOR_Fortress_DEF_Sniper": "n",
							"FOR_Fortress_DEF_Inf_VS_Inf": "o",
							"FOR_Fortress_DEF_Veh_VS_Air": "u",
							"FOR_Fortress_DEF_Turret_VS_Inf": "m",
							"FOR_Fortress_DEF_Turret_VS_Veh": "v",
							"FOR_Fortress_DEF_Turret_VS_Air": "f",
							"FOR_Fortress_DEF_Turret_VS_Inf_ranged": "a",
							"FOR_Fortress_DEF_Turret_VS_Veh_ranged": "d",
							"FOR_Fortress_DEF_Turret_VS_Air_ranged": "e",
							"FOR_Fortress_DEF_Mammoth": "y",
	
							/* Forgotten Infected Defense Units */
							"FOR_GDI_Wall": "w",
							"FOR_GDI_Cannon": "c",
							"FOR_GDI_Antitank Barrier": "t",
							"FOR_GDI_Barbwire": "b",
							"FOR_GDI_Turret": "m",
							"FOR_GDI_Flak": "f",
							"FOR_GDI_Art Inf": "r",
							"FOR_GDI_Art Air": "e",
							"FOR_GDI_Art Tank": "a",
							"FOR_GDI_Def_APC Guardian": "g",
							"FOR_GDI_Def_Missile Squad": "q",
							"FOR_GDI_Def_Pitbull": "p",
							"FOR_GDI_Def_Predator": "d",
							"FOR_GDI_Def_Sniper": "s",
							"FOR_GDI_Def_Zone Trooper": "z",
							"FOR_NOD_Def_Antitank Barrier": "t",
							"FOR_NOD_Def_Art Air": "e",
							"FOR_NOD_Def_Art Inf": "r",
							"FOR_NOD_Def_Art Tank": "a",
							"FOR_NOD_Def_Attack Bike": "p",
							"FOR_NOD_Def_Barbwire": "b",
							"FOR_NOD_Def_Black Hand": "z",
							"FOR_NOD_Def_Cannon": "c",
							"FOR_NOD_Def_Confessor": "s",
							"FOR_NOD_Def_Flak": "f",
							"FOR_NOD_Def_MG Nest": "m",
							"FOR_NOD_Def_Militant Rocket Soldiers": "q",
							"FOR_NOD_Def_Reckoner": "g",
							"FOR_NOD_Def_Scorpion Tank": "d",
							"FOR_NOD_Def_Wall": "w",
	
							/* GDI Offense Units */
							"GDI_APC Guardian": "g",
							"GDI_Commando": "c",
							"GDI_Firehawk": "f",
							"GDI_Juggernaut": "j",
							"GDI_Kodiak": "k",
							"GDI_Mammoth": "m",
							"GDI_Missile Squad": "q",
							"GDI_Orca": "o",
							"GDI_Paladin": "a",
							"GDI_Pitbull": "p",
							"GDI_Predator": "d",
							"GDI_Riflemen": "r",
							"GDI_Sniper Team": "s",
							"GDI_Zone Trooper": "z",
	
							/* Nod Offense Units */
							"NOD_Attack Bike": "b",
							"NOD_Avatar": "a",
							"NOD_Black Hand": "z",
							"NOD_Cobra": "r",
							"NOD_Commando": "c",
							"NOD_Confessor": "s",
							"NOD_Militant Rocket Soldiers": "q",
							"NOD_Militants": "m",
							"NOD_Reckoner": "k",
							"NOD_Salamander": "l",
							"NOD_Scorpion Tank": "o",
							"NOD_Specter Artilery": "p",
							"NOD_Venom": "v",
							"NOD_Vertigo": "t",
	
							"<last>": "."
						},
						make_sharelink: function () {
							try {
								var selected_base = cnctaopt.selected_base;
								var city_id = selected_base.get_Id();
								var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(city_id);
								var own_city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
								var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
								var server = ClientLib.Data.MainData.GetInstance().get_Server();
								var coordX = city.get_X();
								var coordY = city.get_Y();
								tbase = selected_base;
								tcity = city;
								scity = own_city;
								//console.log("Target City: ", city);
								//console.log("Own City: ", own_city);
								var link = "http://cnctaopt.com/?map=";
								link += "3~"; /* link version */
								switch (city.get_CityFaction()) {
									case 1:
										/* GDI */
										link += "G~";
										break;
									case 2:
										/* NOD */
										link += "N~";
										break;
									case 3:
										/* FOR faction - unseen, but in GAMEDATA */
									case 4:
										/* Forgotten Bases */
									case 5:
										/* Forgotten Camps */
									case 6:
										/* Forgotten Outposts */
									case 8: 
										/* Infected camps ; (added zbluebugz 01/2021) */
										link += "F~";
										break;
									default:
										console.log("cnctaopt: Unknown faction: " + city.get_CityFaction());
										link += "E~";
										break;
								}
								/* offense faction; correction by zbluebugz 01/2021; changed switch(city.get..) to switch(own_city.get..) */
								switch (own_city.get_CityFaction()) {
									case 1:
										/* GDI */
										link += "G~";
										break;
									case 2:
										/* NOD */
										link += "N~";
										break;
									case 3:
										/* FOR faction - unseen, but in GAMEDATA */
									case 4:
										/* Forgotten Bases */
									case 5:
										/* Forgotten Camps */
									case 6:
										/* Forgotten Outposts */
										if (own_city.get_CityFaction() == 1) {
											link += "G~";
										}
										else if (own_city.get_CityFaction() == 2) {
											link += "N~";
										}
										break;
									default:
										console.log("cnctaopt: Unknown faction: " + own_city.get_CityFaction());
										link += "E~";
										break;
								}
								link += city.get_Name() + "~";
								defense_units = [];
								for (var i = 0; i < 20; ++i) {
									var col = [];
									for (var j = 0; j < 9; ++j) {
										col.push(null);
									}
									defense_units.push(col);
								}
								var defense_unit_list = getDefenseUnits(city);
								if (PerforceChangelist >= 376877) {
									for (var i in defense_unit_list) {
										var unit = defense_unit_list[i];
										defense_units[unit.get_CoordX()][unit.get_CoordY() + 8] = unit;
									}
								} else {
									for (var i = 0; i < defense_unit_list.length; ++i) {
										var unit = defense_unit_list[i];
										defense_units[unit.get_CoordX()][unit.get_CoordY() + 8] = unit;
									}
								}
	
								offense_units = [];
								for (var i = 0; i < 20; ++i) {
									var col = [];
									for (var j = 0; j < 9; ++j) {
										col.push(null);
									}
									offense_units.push(col);
								}
	
								if (city.get_CityFaction() == 1 || city.get_CityFaction() == 2) {
									var offense_unit_list = getOffenseUnits(city);
								}
								else {
									var offense_unit_list = getOffenseUnits(own_city);
								}
								if (PerforceChangelist >= 376877) {
									for (var i in offense_unit_list) {
										var unit = offense_unit_list[i];
										offense_units[unit.get_CoordX()][unit.get_CoordY() + 16] = unit;
									}
								} else {
									for (var i = 0; i < offense_unit_list.length; ++i) {
										var unit = offense_unit_list[i];
										offense_units[unit.get_CoordX()][unit.get_CoordY() + 16] = unit;
									}
								}
	
								var techLayout = findTechLayout(city);
								var buildings = findBuildings(city);
								for (var i = 0; i < 20; ++i) {
									row = [];
									for (var j = 0; j < 9; ++j) {
										var spot = i > 16 ? null : techLayout[j][i];
										var level = 0;
										var building = null;
										if (spot && spot.BuildingIndex >= 0) {
											building = buildings[spot.BuildingIndex];
											level = building.get_CurrentLevel();
										}
										var defense_unit = defense_units[j][i];
										if (defense_unit) {
											level = defense_unit.get_CurrentLevel();
										}
										var offense_unit = offense_units[j][i];
										if (offense_unit) {
											level = offense_unit.get_CurrentLevel();
										}
										if (level > 1) {
											link += level;
										}
	
										switch (i > 16 ? 0 : city.GetResourceType(j, i)) {
											case 0:
												if (building) {
													var techId = building.get_MdbBuildingId();
													if (GAMEDATA.Tech[techId].n in cnctaopt.keymap) {
														link += cnctaopt.keymap[GAMEDATA.Tech[techId].n];
													} else {
														console.log("cnctaopt [5]: Unhandled building: " + techId, building);
														link += ".";
													}
												} else if (defense_unit) {
													if (defense_unit.get_UnitGameData_Obj().n in cnctaopt.keymap) {
														link += cnctaopt.keymap[defense_unit.get_UnitGameData_Obj().n];
													} else {
														console.log("cnctaopt [5]: Unhandled unit: " + defense_unit.get_UnitGameData_Obj().n);
														link += ".";
													}
												} else if (offense_unit) {
													if (offense_unit.get_UnitGameData_Obj().n in cnctaopt.keymap) {
														link += cnctaopt.keymap[offense_unit.get_UnitGameData_Obj().n];
													} else {
														console.log("cnctaopt [5]: Unhandled unit: " + offense_unit.get_UnitGameData_Obj().n);
														link += ".";
													}
												} else {
													link += ".";
												}
												break;
											case 1:
												/* Crystal */
												if (spot.BuildingIndex < 0) link += "c";
												else link += "n";
												break;
											case 2:
												/* Tiberium */
												if (spot.BuildingIndex < 0) link += "t";
												else link += "h";
												break;
											case 4:
												/* Woods */
												link += "j";
												break;
											case 5:
												/* Scrub */
												link += "h";
												break;
											case 6:
												/* Oil */
												link += "l";
												break;
											case 7:
												/* Swamp */
												link += "k";
												break;
											default:
												console.log("cnctaopt [4]: Unhandled resource type: " + city.GetResourceType(j, i));
												link += ".";
												break;
										}
									}
								}
								/* Tack on our alliance bonuses */
								if (alliance && scity.get_AllianceId() == tcity.get_AllianceId()) {
									link += "~" + alliance.get_POITiberiumBonus();
									link += "~" + alliance.get_POICrystalBonus();
									link += "~" + alliance.get_POIPowerBonus();
									link += "~" + alliance.get_POIInfantryBonus();
									link += "~" + alliance.get_POIVehicleBonus();
									link += "~" + alliance.get_POIAirBonus();
									link += "~" + alliance.get_POIDefenseBonus();
								}
								if (server.get_TechLevelUpgradeFactorBonusAmount() != 1.20) {
									link += "~newEconomy";
								}
								//console.log("cnctaopt: get_TechLevelUpgradeFactorBonusAmount = ", server.get_TechLevelUpgradeFactorBonusAmount());
								window.server = server;
								// append base's coords to link
								link += "~X" + coordX + "Y" + coordY ;
								// append world id and world name
	                            				link += "~WID=" + ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId();
	                            				link += "~WN=" + ClientLib.Data.MainData.GetInstance().get_Server().get_Name();
								//console.log(link);
								window.open(link, "_blank");
							} catch (e) {
								console.log("cnctaopt [1]: ", e);
							}
						}
					};
					if (!webfrontend.gui.region.RegionCityMenu.prototype.__cnctaopt_real_showMenu) {
						webfrontend.gui.region.RegionCityMenu.prototype.__cnctaopt_real_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
					}
	
					var check_ct = 0;
					var check_timer = null;
					var button_enabled = 123456;
					/* Wrap showMenu so we can inject our Sharelink at the end of menus and
					* sync Base object to our cnctaopt.selected_base variable  */
					webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selected_base) {
						try {
							var self = this;
							//console.log(selected_base);
							cnctaopt.selected_base = selected_base;
							if (this.__cnctaopt_initialized != 1) {
								this.__cnctaopt_initialized = 1;
								this.__cnctaopt_links = [];
								for (var i in this) {
									try {
										if (this[i] && this[i].basename == "Composite") {
											var link = new qx.ui.form.Button("CnCTAOpt", "http://cnctaopt.com/favicon.ico");
											link.addListener("execute", function () {
												var bt = qx.core.Init.getApplication();
												bt.getBackgroundArea().closeCityInfo();
												cnctaopt.make_sharelink();
											});
											this[i].add(link);
											this.__cnctaopt_links.push(link);
										}
									} catch (e) {
										console.log("cnctaopt [2]: ", e);
									}
								}
							}
							var tf = false;
							switch (selected_base.get_VisObjectType()) {
								case ClientLib.Vis.VisObject.EObjectType.RegionCityType:
									switch (selected_base.get_Type()) {
										case ClientLib.Vis.Region.RegionCity.ERegionCityType.Own:
											tf = true;
											break;
										case ClientLib.Vis.Region.RegionCity.ERegionCityType.Alliance:
										case ClientLib.Vis.Region.RegionCity.ERegionCityType.Enemy:
											tf = true;
											break;
									}
									break;
								case ClientLib.Vis.VisObject.EObjectType.RegionGhostCity:
									tf = false;
									console.log("cnctaopt: Ghost City selected.. ignoring because we don't know what to do here");
									break;
								case ClientLib.Vis.VisObject.EObjectType.RegionNPCBase:
									tf = true;
									break;
								case ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp:
									tf = true;
									break;
							}
	
							var orig_tf = tf;
	
							function check_if_button_should_be_enabled() {
								try {
									tf = orig_tf;
									var selected_base = cnctaopt.selected_base;
									var still_loading = false;
									if (check_timer !== null) {
										clearTimeout(check_timer);
									}
	
									/* When a city is selected, the data for the city is loaded in the background.. once the
									* data arrives, this method is called again with these fields set, but until it does
									* we can't actually generate the link.. so this section of the code grays out the button
									* until the data is ready, then it'll light up. */
									if (selected_base && selected_base.get_Id) {
										var city_id = selected_base.get_Id();
										var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(city_id);
										//if (!city || !city.m_CityUnits || !city.m_CityUnits.m_DefenseUnits) {
										//console.log("City", city);
										//console.log("get_OwnerId", city.get_OwnerId());
										if (!city || city.get_OwnerId() === 0) {
											still_loading = true;
											tf = false;
										}
									} else {
										tf = false;
									}
									if (tf != button_enabled) {
										button_enabled = tf;
										for (var i = 0; i < self.__cnctaopt_links.length; ++i) {
											self.__cnctaopt_links[i].setEnabled(tf);
										}
									}
									if (!still_loading) {
										check_ct = 0;
									} else {
										if (check_ct > 0) {
											check_ct--;
											check_timer = setTimeout(check_if_button_should_be_enabled, 100);
										} else {
											check_timer = null;
										}
									}
								} catch (e) {
									console.log("cnctaopt [3]: ", e);
									tf = false;
								}
							}
	
							check_ct = 50;
							check_if_button_should_be_enabled();
						} catch (e) {
							console.log("cnctaopt [3]: ", e);
						}
						this.__cnctaopt_real_showMenu(selected_base);
					};
				}
	
				/* Nice load check (ripped from AmpliDude's LoU Tweak script) */
				function cnc_check_if_loaded() {
					try {
						if (typeof qx != 'undefined') {
							a = qx.core.Init.getApplication(); // application
							if (a) {
								cnctaopt_create();
							} else {
								window.setTimeout(cnc_check_if_loaded, 1000);
							}
						} else {
							window.setTimeout(cnc_check_if_loaded, 1000);
						}
					} catch (e) {
						if (typeof console != 'undefined') console.log(e);
						else if (window.opera) opera.postError(e);
						else GM_log(e);
					}
				}
				if (/commandandconquer\.com/i.test(document.domain)) window.setTimeout(cnc_check_if_loaded, 1000);
			};
	
			// injecting because we can't seem to hook into the game interface via unsafeWindow
			//   (Ripped from AmpliDude's LoU Tweak script)
			var script_block = document.createElement("script");
			txt = cnctaopt_main.toString();
			script_block.innerHTML = "(" + txt + ")();";
			script_block.type = "text/javascript";
			if (/commandandconquer\.com/i.test(document.domain)) document.getElementsByTagName("head")[0].appendChild(script_block);
		})();
	} catch (e) {
		GM_log(e);
	}
	
	/*
	End of CnCTAOpt Link Button
	*/
