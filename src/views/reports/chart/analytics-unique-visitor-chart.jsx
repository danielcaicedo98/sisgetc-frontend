const chartData = {
  height: 230,
  type: 'line',
  options: {
    chart: {
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    legend: {
      position: 'top'
    },
    xaxis: {
      type: 'datetime',
      categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000'],
      axisBorder: {
        show: false
      },
      label: {
        style: {
          color: '#ccc'
        }
      }
    },
    yaxis: {
      show: true,
      min: 10,
      max: 70,
      labels: {
        style: {
          color: '#ccc'
        }
      }
    },
    colors: ['#D9831A', '#BF0426'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        gradientToColors: ['#D9831A', '#BF0426'],
        shadeIntensity: 0.5,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    markers: {
      size: 5,
      colors: ['#D9831A', '#BF0426'],
      opacity: 0.9,
      strokeWidth: 2,
      hover: {
        size: 7
      }
    },
    grid: {
      borderColor: '#cccccc3b'
    }
  },
  series: [
    {
      name: 'Gastos',
      data: [20, 50, 30, 60, 30, 50]
    },
    {
      name: 'Ventas',
      data: [60, 30, 65, 45, 67, 35]
    }
  ]
};
export default chartData;
