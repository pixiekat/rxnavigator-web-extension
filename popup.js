const RX_NAV_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

document.getElementById('fetchDrugs').addEventListener('click', function() {
  const drugName = document.getElementById('drugName').value;
  if (drugName.trim() === '') {
    alert('Please enter a drug name.');
    return;
  }

  fetch(RX_NAV_BASE_URL + `/drugs.json?name=${encodeURIComponent(drugName)}`)
    .then(response => response.json())
    .then(data => {
      const drugTable = document.getElementById('drugTable').getElementsByTagName('tbody')[0];
      drugTable.innerHTML = '';

      if (data.drugGroup.conceptGroup !== undefined) {
        data.drugGroup.conceptGroup.forEach(group => {
          let tty = group.tty;
          if (tty == "SBD" || tty == "SCD") {
            //https://rxnav.nlm.nih.gov/REST/rxcui/${drug.rxcui}/related.json?tty=IN
            group.conceptProperties.forEach(drug => {
              fetch(RX_NAV_BASE_URL + `/ndcproperties.json?id=${drug.rxcui}&ndcstatus=active`)
                .then(response => response.json())
                .then(data => {
                  if (data.ndcPropertyList.ndcProperty !== undefined) {
                    var ndcCodes = [];
                    data.ndcPropertyList.ndcProperty.forEach(ndcProperty => {
                      ndcProperty.propertyConceptList.propertyConcept.forEach(propertyConcept => {
                        if (!ndcCodes.includes(ndcProperty.ndcItem)) {
                          ndcCodes.push(ndcProperty.ndcItem);
                          const row = drugTable.insertRow();
                          const cell1 = row.insertCell(0);
                          const cell2 = row.insertCell(1);
                          const cell3 = row.insertCell(2);
                          const cell4 = row.insertCell(3);
                          const cell5 = row.insertCell(4);
                          const cell6 = row.insertCell(5);

                          cell1.textContent = drug.name;
                          if (propertyConcept.propName == "COLORTEXT" && propertyConcept.propValue.length > 0) {
                            cell2.textContent = propertyConcept.propValue;
                          }
                          else if (propertyConcept.propName == "COLOR" && propertyConcept.propValue.length > 0) {
                            cell2.textContent = propertyConcept.propValue;
                          }
                          else {
                            cell2.textContent = "No Color";
                          }

                          if (propertyConcept.propName == "LABELER") {
                            cell3.textContent = propertyConcept.propValue;
                          }

                          if (propertyConcept.propName == "LABEL_TYPE") {
                            cell4.textContent = propertyConcept.propValue;
                          }

                          cell5.textContent = drug.rxcui;

                          cell6.textContent = ndcProperty.ndc10;
                        }
                        
                      });
                      
                    });                    
                  }
                });
              
            });
          }
        });
      }

      /*
      <propertyConceptList>
                <propertyConcept>
                    <propName>COLORTEXT</propName>
                    <propValue>ORANGE(PEACH)</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>COLOR</propName>
                    <propValue>C48331</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>DM_SPL_ID</propName>
                    <propValue>536403</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>IMPRINT_CODE</propName>
                    <propValue>MSD;735</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>LABELER</propName>
                    <propValue>Merck Sharp &amp; Dohme LLC</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>LABEL_TYPE</propName>
                    <propValue>HUMAN PRESCRIPTION DRUG</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>MARKETING_CATEGORY</propName>
                    <propValue>NDA</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>MARKETING_EFFECTIVE_TIME_HIGH</propName>
                    <propValue>20211231</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>MARKETING_EFFECTIVE_TIME_LOW</propName>
                    <propValue>19911223</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>MARKETING_STATUS</propName>
                    <propValue>COMPLETED</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>NDA</propName>
                    <propValue>NDA019766</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>SCORE</propName>
                    <propValue>1</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>SHAPE</propName>
                    <propValue>C48345</propValue>
                </propertyConcept>
                <propertyConcept>
                    <propName>SIZE</propName>
                    <propValue>9 mm</propValue>
                </propertyConcept>
            </propertyConceptList>*/
      //else {
      //  const row = drugTable.insertRow();
      //  const cell1 = row.insertCell(0);
     //   cell1.colSpan = 2;
      //  cell1.textContent = 'No drugs found.';
      //}
    })
    .catch(error => console.error('Error fetching data:', error));
});
