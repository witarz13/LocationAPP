<template>
    <div>
        <section class="ui container ">
            <div class="ui grid">
                
                    <div class="ui column">
                        <div class="ui segment top left aligned">
                            <form style class="ui segment large form">
                                
                                <!-- <input class="ui message blue" v-bind="timeZone"/> -->
                                <div class="ui segment blue">
                                    <div class="field">
                                        <div class="ui right icon input large" :class="{loading:isLoading}">
                                            <input type="text" 
                                            placeholder="enter the location you looking for"
                                            v-model="address" 
                                            id="autocomplete" 
                                            ref = "autocomplete"/>
                                            <i class ="dot circle link icon" @click="selfLocation"></i>
                                        </div>
                                        <div class="ui message blue">{{ timeZone }} <i class="large rightlink icon trash" @click="delectLocation"></i></div>
                                        
                                    </div>
                                </div>
                                
                                <div class="ui table fixed-height">
                                    <table class="ui celled table">
                                    <tr class="small_row" v-for="(item, index) in addressList" :key="index">
                                    
                                    <td  @click="showInMap(item.geometry.location.lat(),item.geometry.location.lng()
                                    )">
                                    <input type="checkbox" name="example" @change="checkBox(index)">
                                    {{ item.formatted_address }}</td>
                                    </tr>
                                    </table>
                                </div>
                            </form>
                        </div>
                       
                    
                </div>
            </div>        
        </section>
        <section id="map" ref="map"></section> 
    </div>
</template>
<script>


import axios from 'axios'

export default{
    
    data(){
        return{
            address:'',
            isLoading:false,
            addressList: [],
            checkBoxlist:[],
            timeZone:'',
                
            }
        },
    
    mounted(){
        let google = window.google;
        let autoCom= new google.maps.places.Autocomplete(
            this.$refs["autocomplete"],{
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(43.65107,-79.34701)
                ),
            }
        );
        autoCom.addListener("place_changed", ()=>{
            let place = autoCom.getPlace();
            this.showInMap(place.geometry.location.lat(),
            place.geometry.location.lng());
            this.addressList.push(place);
            this.getLocation(place.geometry.location.lat(),
            place.geometry.location.lng());
            
        });
    },
    methods: {
        selfLocation (){
            
            this.isLoading = true;
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(postion =>{
                    this.getLocation(postion.coords.latitude,postion.coords.longitude);
                    this.isLoading = false;
                    this.showInMap(postion.coords.latitude,postion.coords.longitude);
                })

            }else{
                console.log("Your browser not support for location");
                this.isLoading = false;
            }
        },
        getLocation(lat,lng){
            axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+ lat + "," 
            + lng + "&key=API_Key").then(response =>{
                if(response.data.error_message){
                    console.log(response.data.error_message);
                }else{
                    this.address=response.data.results[0].formatted_address;
                }
            })
            .catch(error=>{
                console.log(error.message);
                this.isLoading = false;
            })
        },
        showInMap(lat,lng){
            const google = window.google;
            var timestamp = Math.floor(Date.now() / 1000);
            axios.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + lat + ',' + lng + 
            '&timestamp=' + timestamp + 
            "&key=API_KEY").then(response =>{
                if(response.data.error_message){
                    console.log(response.data.error_message);
                }else{
                    
                    let curTimestamp=timestamp+response.data.rawOffset+response.data.dstOffset+(3600*4);
                    let currentTime=new Date(curTimestamp*1000);
                    this.timeZone=response.data.timeZoneName+" "+currentTime.toLocaleTimeString();
                }
            })
            .catch(error=>{
                console.log(error.message);
                this.isLoading = false;
            })
           
            let map = new google.maps.Map(this.$refs["map"],
            {
                zoom:15,
                center: {lat,lng},
                mapTpeyId:'terrain ' 
            });
            new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            });
     
        },
        delectLocation(){
            this.checkBoxlist.sort((a, b) => b - a);
            this.checkBoxlist.forEach(
                index => {  this.addressList.splice(index, 1);}
            )
            this.checkBoxlist=[];
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');

            checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            });

        },
        checkBox(index){
            const check = this.checkBoxlist.indexOf(index);
            if (check !== -1) {
                this.checkBoxlist = this.checkBoxlist.filter(item => item !== index);
                console.log(this.checkBoxlist);
            }else{
                this.checkBoxlist.push(index);
                console.log(this.checkBoxlist);
            }


        },
        
    }
}

</script>
<style>
.dot.circle.icon {
    background-color: #8698f5;
    color: white;
  }
.ui.container{
    background-color: #cad0f2;
}
  
  .pac-item:hover {
    background-color: #ececec;
  }
  
  .pac-item-query {
    font-size: 16px;
  }
.ui.segment.large.form{
    position:absolute;
    top:0;
    left:0;
}
.fixed-height {
  max-height: 400px; 
  overflow-y:auto;
}

#map {
    position:absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
  }

</style>