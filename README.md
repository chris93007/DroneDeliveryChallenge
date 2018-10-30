## Assumptions

* All orders are placed and delivered on the same day
* Warehouse is in the center and therefore has coordinates (0,0)
* Latest departure time of the drone <= 10PM. Drone may return after 10PM
* NPS is calcuted based on **number** of promoters and not the rating they gave
* No duplicate orders to the same house
* File is not empty
* File is of correct format
* Customers who received their orders between 1hr-1hr59min59sec from the time they placed their order would give a rating of '9'. and so on

| Time to Delivery (hrs) | Rating       | Category  |
| -------------          | -------------| -----------
| 0>t<1                  |10            |  promoter
| 1<=t<2                 |9             |  promoter 
| 2<=t<3                 |8             |  neutral 
| 3<=t<4                 |7             |  neutral
| 4<=t<5                 |6             |  detractor
| 5<=t<6                 |5             |  detractor 
| 6<=t<7                 |4             |  detractor 
| 7<=t<8                 |3             |  detractor
| 8<=t<9                 |2             |  detractor 
| 9<=t<10                |1             |  detractor 
| t>=10                  |0             |  detractor 
