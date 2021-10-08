//let data = d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{


//creating margins for the width and height
    var margin = ({top:30, bottom:20, left:50, right:20})
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    console.log(height)
    let state = 1
    const svg = d3.select('.barchart_Container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    console.log(height)
    
    const x = d3
    .scaleBand()
    .rangeRound([0, width])
    .paddingInner(.1);
    
    const y = d3
    .scaleLinear()
    .range([height,0]);
    console.log(height)
    console.log(width)
/*
    const xAxis = d3
    .axisBottom()
    .scale(xScale);
//i think i can just do .attr('class', 'x-axis') here if i append g
    const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .ticks(5, 's');
*/


    svg.append('g')
        .attr('class', 'x-axis')
        //.call(xAxis)
        .attr('transform', `translate(0, ${height})`);

    svg.append('g')
    .attr('class', 'y-axis');
    
    //.call(yAxis)

    svg.append('text')
        .attr('id', 'axis-labels')
        .attr('x', 0)
        .attr('y', -10);


    


    //everything has been generically declared^^^, now function update below

    let type = d3.select('#group-by').node().value

    function update(data, type){

        x.domain(data.map (d=> d.company))
        y.domain([0, d3.max(data, d=> d[type])])
    
    /*
    svg.selectAll('rect')
        .data(data)
        .enter()
        .attr('width', xScale.bandwidth()) //xScale.bandwidth() to set the width of the bar
        .attr('height', ___)
        .attr('x',___)
        .attr('y', d => height - yScale(d[___]))
        .attr('class', 'rect');
    */
    //ignore the top stuff for now that was for static
    svg.selectAll('rect')
    .transition()
    .duration(1000)
    .attr('fill', '#BC9B6A')
    .remove()

    const bars = svg.selectAll('.bar').data(data, d=> d[type]);

    bars
    .enter()
    .data(data, d=> d.company)
    .append('rect')
    .attr('x', d=>x(d.company)) 
    .attr('y', height)
    .attr('fill', '#BC9B6A')
    .attr('opacity', .5)
    .merge(bars)
    .transition()
    .delay(function(d,i) {return 100*i;})
    .duration(1000)
    .attr('x', d=> x(d.company))
    .attr('y', d=> y(d[type]))
    .attr('fill', 'maroon')
    .attr('width', x.bandwidth())
    .attr('height', d=> (height - y(d[type])))
    .attr('opacity', .8)

    //do i need to call the axis here again? yes
    const xAxis = d3.axisBottom(x);
        svg.select('.x-axis').transition().duration(1000).call(xAxis);
    const yAxis = d3.axisLeft(y);
        svg.select('.y-axis')
        .transition().duration(1000).call(yAxis);


    svg.select('#axis-labels')
    .text(type);
    //create the axes and title


}

d3.csv('coffee-house-chains.csv', d3.autoType)
    .then(data=>{update(data,type)})
d3.select('#group-by').on('change', (event)=>{
    type = d3.select('#group-by').node().value
    d3.csv('coffee-house-chains.csv', d3.autoType)
    .then(data=>{update(data,type)})

})
d3.select('#sortButton').on('click', (event)=>{
    type = d3.select('#group-by').node().value
    d3.csv('coffee-house-chains.csv', d3.autoType)
    .then(data=>{

        if (state == 1){
            new_data = data.sort(function(a,b){return b[type] - a[type]});
            state = 0
        }
        else{
            new_data = data.sort(function(a,b){return a[type] - b[type]});
            state = 1
        }
        update(new_data, type);

    })})
