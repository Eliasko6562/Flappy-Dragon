package main

import rl "github.com/gen2brain/raylib-go/raylib"

type Player struct {
	Position  rl.Vector3
	Direction rl.Vector3
	Camera   rl.Camera
}
