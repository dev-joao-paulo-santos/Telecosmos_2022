function getStarData(hoverStar){
  var div_elem;
    switch (hoverStar){
      case 0:
        div_elem = document.getElementById("sun").innerHTML;
        return div_elem;
        break;
      case 1:
        div_elem = document.getElementById("mercury").innerHTML;
        return div_elem;
        break;
      case 2:
        div_elem = document.getElementById("venus").innerHTML;
        return div_elem;
        break;
      case 3:
        div_elem = document.getElementById("earth").innerHTML;
        return div_elem;
        break;
      case 4:
        div_elem = document.getElementById("moon").innerHTML;
        return div_elem;
        break;
      case 5:
        div_elem = document.getElementById("mars").innerHTML;
        return div_elem;
        break;
      case 6:
        div_elem = document.getElementById("jupiter").innerHTML;
        return div_elem;
        break;
      case 7:
        div_elem = document.getElementById("saturn").innerHTML;
        return div_elem;
        break;
      case 8:
        div_elem = document.getElementById("uranus").innerHTML;
        return div_elem;
        break;
      case 9:
        div_elem = document.getElementById("neptune").innerHTML;
        return div_elem;
        break;
      default:
        return "error!";
    }
}