# vsMediaTest
Skill Assesment for VS Media

Search bar performs case insensitive partial string match and accepts Boolean operators: OR(,) AND(&) NOT(!)
e.g. “red,green&car!convertible”= (red OR green ) car NOT convertible
    
    OR operators divided by AND are treated as a single argument 
    
        e.g. “red,green&car,house” = (red OR green) (car OR house)
        
    All arguments after after “!” are treated as NOR 
    
        e.g. “red!ball,hat&toy!”= red NOT ball NOR hat NOR toy
        
    Impossible queries are allowed but return no results 
    
        e.g. “red!red” returns no results

I also made minor changes to provided data:

    I separated phone number and extension
    
        -Now storing phone and ext as a string containing only numbers. 
        
        -Formatting [e.g. “(949)244-4063”] is done on the frontend. 
        
        -Phone Number has to be a string to allow numbers that start with zero.
        
    Zipcode was reduced to delivery area (first five digits)
    
        -Also needs to be a string to account for zipcodes starting with zero e.g. Maine
