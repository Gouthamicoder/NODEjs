const employ=
{
    name:`GOUTHAMI`,
    age:40,
    dept:`CSE`,
    display()
    {
        console.log(`hello ${this.name} your age is ${this.age}`);
    }
    
};
employ.display();
const colors=['red','blue','pink',`green`];
colors.forEach(color=>console.log(color));
const lengths = colors.map(color => color.length);
console.log(lengths);
console.log(colors.length);
const num=[9,10,11];
num.forEach((x)=>console.log((x+8)));
const num2= num.map((x)=>x*2)
console.log(num2)
//console.log(num)