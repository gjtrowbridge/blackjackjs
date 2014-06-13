#! /usr/bin/python
from os import rename
import math

suits = ['clubs', 'spades', 'hearts', 'diamonds']
for num in range(1, 53):
  val = int(math.floor((num-1) / 4) + 1)
  if (val != 1):
    val = 15 - val
  suit = suits[(num - 1) % 4]
  newName = str(val) + '_' + suit
  #print newName
  rename(str(num) + '.png', newName)