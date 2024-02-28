export function wrapBasicInformation(sessionInfo, members, therapists){
    let therapyList = "";
    let memberList = "";
    for(let i=0; i<members.length; i++){
        memberList += members[i].name + " ,";
    }
    for(let i=0; i<therapists.length; i++){
        therapyList += therapists[i].name + " ,";
    }

    
    return (
        {
            "blocks": [
                {
                    "key": "ap6rt",
                    "text": sessionInfo.identifier,
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [
                        {
                            "offset": 0,
                            "length": 18,
                            "style": "BOLD"
                        }
                    ],
                    "entityRanges": [],
                    "data": {
                        "textAlign": "center",
                        "fontSize": "fontSizeH2"
                    }
                },
                {
                    "key": "domp3",
                    "text": `Date of Session: ${sessionInfo.dateOfSession}`,
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [
                        {
                            "offset": 0,
                            "length": 15,
                            "style": "BOLD"
                        }
                    ],
                    "entityRanges": [],
                    "data": {}
                },
                {
                    "key": "5n4pn",
                    "text": `Time of Session: ${sessionInfo.timeOfSession}`,
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [
                        {
                            "offset": 0,
                            "length": 15,
                            "style": "BOLD"
                        }
                    ],
                    "entityRanges": [],
                    "data": {}
                },
                {
                    "key": "2k549",
                    "text": `Location: ${sessionInfo.location}`,
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [
                        {
                            "offset": 0,
                            "length": 8,
                            "style": "BOLD"
                        }
                    ],
                    "entityRanges": [],
                    "data": {}
                },
                {
                    "key": "9r1t",
                    "text": "",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                },
                {
                    "key": "jm4q",
                    "text": "Therapist Information",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [
                        {
                            "offset": 0,
                            "length": 21,
                            "style": "BOLD"
                        }
                    ],
                    "entityRanges": [],
                    "data": {
                        "textAlign": "center"
                    }
                },
                {
                    "key": "c3gbc",
                    "text": "",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                },
                {
                    "key": "476np",
                    "text": `Name(s) of Therapist(s)/Facilitator(s): ${therapyList}`,
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [
                        {
                            "offset": 0,
                            "length": 38,
                            "style": "BOLD"
                        }
                    ],
                    "entityRanges": [],
                    "data": {}
                },
                {
                    "key": "1ij0e",
                    "text": "Contact Information: xiang.yao@northeastern.edu, xiangyaohong@gmail.com",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [
                        {
                            "offset": 0,
                            "length": 19,
                            "style": "BOLD"
                        }
                    ],
                    "entityRanges": [],
                    "data": {}
                },
                {
                    "key": "a86tl",
                    "text": "",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                },
                {
                    "key": "eq5a7",
                    "text": "Attendance",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [
                        {
                            "offset": 0,
                            "length": 10,
                            "style": "BOLD"
                        }
                    ],
                    "entityRanges": [],
                    "data": {
                        "textAlign": "center"
                    }
                },
                {
                    "key": "6odcr",
                    "text": "",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                },
                {
                    "key": "3defp",
                    "text": `Present Members: ${memberList}`,
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [
                        {
                            "offset": 0,
                            "length": 15,
                            "style": "BOLD"
                        }
                    ],
                    "entityRanges": [],
                    "data": {}
                },
                {
                    "key": "4qb3n",
                    "text": "",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                }
            ],
            "entityMap": {}
        }
    );
}
